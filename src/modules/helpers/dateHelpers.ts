  const daysBetween = (start: string | Date, end: string | Date) => {
  const s = new Date(start);
  const e = new Date(end);

  const diff = Math.ceil((+e - +s) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};
 

export default daysBetween;