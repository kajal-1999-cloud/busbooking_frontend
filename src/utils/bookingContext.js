import Cookies from "js-cookie";

const BOOKING_CONTEXT_KEY = "bookingContext";
const COOKIE_OPTIONS = { path: "/", expires: 1 / 48 }; // 30 minutes

export const saveBookingContext = ({
  returnPath,
  tripId,
  seats,
  points,
  tripData,
  sourceCity,
  destinationCity,
}) => {
  Cookies.set(
    BOOKING_CONTEXT_KEY,
    JSON.stringify({
      returnPath,
      tripId,
      seats,
      points,
      tripData,
      sourceCity,
      destinationCity,
    }),
    COOKIE_OPTIONS
  );
};

export const getBookingContext = () => {
  const raw = Cookies.get(BOOKING_CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearBookingContext = () => {
  Cookies.remove(BOOKING_CONTEXT_KEY, { path: "/" });
};
