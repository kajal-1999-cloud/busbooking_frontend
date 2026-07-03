import Endpoints from "../../../network/endpoints";
import request from "../../../network/request";

import { updateTripsStatus } from "../redux/slice";
import { togglePriceRange } from "../../filters/slice";
import { showError } from "../../../utils/toast";
export const fetchTripsList = (searchInfo) => {
  return async function (dispatch) {
    dispatch(updateTripsStatus({ status: "pending" }));
    const { success, data } = await request({
      url: Endpoints.tripsList,
      method: "POST",
      data: searchInfo,
    });

    if (success) {
      const priceRange = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      data?.trips?.forEach((trip) => {
        if (trip.minPrice < priceRange[0]) priceRange[0] = trip.minPrice;
        if (trip.maxPrice > priceRange[1]) priceRange[1] = trip.maxPrice;
      });

      if (data?.trips?.length && priceRange[0] <= priceRange[1]) {
        dispatch(togglePriceRange(priceRange));
      }

      dispatch(updateTripsStatus({ status: "success", data: data }));
    } else {
      showError("Failed to load trips. Please try again.");
      dispatch(updateTripsStatus({ status: "error" }));
    }
  };
};
