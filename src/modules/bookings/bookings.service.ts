import { pool } from "../../config/db";
import daysBetween from "../helpers/dateHelpers";


interface BookingDetails {
  id: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: 'active' | 'cancelled' | 'returned';
}
const createBooking = async (payload: BookingDetails) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    if (new Date(rent_end_date) < new Date (rent_start_date)){
        throw { status: 400, message: 'rent_end_date must be after rent_start_date' };
    }

    const findVehicle = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
    const vehicle = findVehicle.rows[0];

    if (!vehicle) {
        throw { status: 404, message: 'Vehicle not found' };
    }

    if (vehicle.availability_status === 'booked') {
        throw { status: 400, message: 'Vehicle is already booked' };
    }

    const overlapCheck = await pool.query(
            `SELECT COUNT(*) as cnt FROM bookings WHERE vehicle_id = $1 AND status = 'active'
             AND NOT (rent_end_date < $2 OR rent_start_date > $3)`,
             [vehicle_id, rent_start_date, rent_end_date]
    );

    if (overlapCheck.rows[0].cnt > 0) {
        throw { status: 400, message: 'Vehicle is already booked for the given date range' };
    }

    const days = daysBetween(rent_start_date, rent_end_date);
    const total_price = Number(Number(vehicle.daily_rent_price) * days).toFixed(2);

    if (Number(total_price) <= 0) {
        throw { status: 400, message: 'Invalid date range' };
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(`INSERT INTO bookings 
                        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)     
                        VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
                        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);

    await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['booked', vehicle_id]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();

    }                                                                    

};

  const listBookings = async (requester: { id: number; role: string }) => {
  if (requester.role === 'admin') {
    const { rows } = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
    return rows;
  } else {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC', [requester.id]);
    return rows;
  }
};

  const getById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
  return rows[0];
};

  const cancelBooking = async ({ bookingId, requester }: any) => {
  const b = await getById(bookingId);
  if (!b) throw { status: 404, message: 'Booking not found' };

  // only customer (owner) can cancel; admin can also but spec says Customer: Cancel booking (before start date only)
  if (requester.role === 'customer' && b.customer_id !== requester.id) throw { status: 403, message: 'Forbidden' };

  const today = new Date();
  const startDate = new Date(b.rent_start_date);
  if (today >= startDate) throw { status: 400, message: 'Cannot cancel booking on/after start date' };

  await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', bookingId]);

  // If no other active booking for the vehicle that overlaps, mark vehicle available
  const overlapping = await pool.query(`SELECT COUNT(*) as cnt FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [b.vehicle_id]);
  if (parseInt(overlapping.rows[0].cnt, 10) === 0) {
    await pool.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['available', b.vehicle_id]);
  }
  return { message: 'Booking cancelled' };
};

  const markReturned = async ({ bookingId }: any) => {
  const b = await getById(bookingId);
  if (!b) throw { status: 404, message: 'Booking not found' };
  if (b.status !== 'active') throw { status: 400, message: 'Booking is not active' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['returned', bookingId]);
    // set vehicle to available (assuming no other active bookings)
    const otherActive = await client.query('SELECT COUNT(*) as cnt FROM bookings WHERE vehicle_id = $1 AND status = $2 AND id != $3', [b.vehicle_id, 'active', bookingId]);
    if (parseInt(otherActive.rows[0].cnt, 10) === 0) {
      await client.query('UPDATE vehicles SET availability_status = $1 WHERE id = $2', ['available', b.vehicle_id]);
    }
    await client.query('COMMIT');
    return { message: 'Booking marked as returned' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};


export const bookingService = {
    createBooking,
    listBookings,
    getById,
    cancelBooking,
    markReturned
};
