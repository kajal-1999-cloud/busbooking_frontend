import Cookies from "js-cookie";
import { getBookingContext } from "./bookingContext";

const navigateAfterAuth = (navigate, locationStateFrom) => {
  const ctx = getBookingContext();
  const fromState = locationStateFrom;

  if (fromState) {
    navigate(fromState, { replace: true });
    return;
  }

  if (ctx?.returnPath) {
    navigate(ctx.returnPath, { replace: true });
    return;
  }

  if (Cookies.get("selectedSeatData")) {
    navigate("/book", { replace: true });
    return;
  }

  navigate("/", { replace: true });
};

export default navigateAfterAuth;
