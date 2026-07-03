import dayjs from "dayjs";

/**
 * Returns travel date as Unix epoch seconds (start of day).
 * Handles dayjs objects, seconds, and milliseconds.
 */
export const getTravelDateEpoch = (value) => {
  if (value == null || value === "") {
    return dayjs().startOf("day").unix();
  }

  if (dayjs.isDayjs(value)) {
    return value.startOf("day").unix();
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    return dayjs().startOf("day").unix();
  }

  // Milliseconds (13+ digits)
  if (num > 1e12) {
    return dayjs(num).startOf("day").unix();
  }

  return dayjs.unix(num).startOf("day").unix();
};
