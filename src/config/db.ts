import { Pool } from 'pg';
import config from './index';


// DB
export const pool = new Pool({
    connectionString: config.connectionString
});

const initDB = async () => {

}



export default initDB