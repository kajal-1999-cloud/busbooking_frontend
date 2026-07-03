import { useDispatch, useSelector } from "react-redux";
import Filters from "../filters";
import Header from "../../components/Header/Header";
import TripsList from "./components/TripsList";
import { allTripsSelector, tripsStatusSelector } from "./redux/selectors";
import { useEffect } from "react";
import { fetchTripsList } from "./redux/thunk";
import { useParams } from "react-router-dom";
import Spinner from "../../utlis/Spiner";
import { clearSelectedSeat, restoreSeatSelection } from "./redux/slice";
import { getBookingContext } from "../../utils/bookingContext";
import { getTravelDateEpoch } from "../../utils/travelDate";
import { addDate } from "../search/slice";
import { clearAllFilters } from "../filters/slice";

const TripsScreen = () => {
  const { sourceCityId, destinationCityId, travelDate } = useParams();
  const allTrips = useSelector(allTripsSelector);
  const dispatch = useDispatch();
  const apiStatus = useSelector(tripsStatusSelector);
  const restoreTripId = useSelector((state) => state.trips.restoreTripId);

  useEffect(() => {
    const normalizedDate = getTravelDateEpoch(travelDate);
    dispatch(addDate(normalizedDate));
    dispatch(clearAllFilters());
    dispatch(
      fetchTripsList({
        sourceCityId,
        destinationCityId,
        travelDate: normalizedDate,
      })
    );
    return () => {
      dispatch(clearSelectedSeat());
    };
  }, [sourceCityId, destinationCityId, travelDate, dispatch]);

  useEffect(() => {
    if (apiStatus !== "success") return;
    const ctx = getBookingContext();
    if (ctx?.tripId && ctx?.seats?.length) {
      dispatch(
        restoreSeatSelection({
          tripId: ctx.tripId,
          seats: ctx.seats,
          points: ctx.points,
        })
      );
    }
  }, [apiStatus, dispatch]);

  if (apiStatus === "init" || apiStatus === "pending") {
    return (
      <>
        <Header />
        <Spinner />
      </>
    );
  }

  if (apiStatus === "error") {
    return (
      <>
        <Header />
        <h2 style={{ textAlign: "center", padding: "2rem" }}>
          Error occured while fetching trips
        </h2>
      </>
    );
  }

  if (!allTrips.length) {
    return (
      <>
        <Header />
        <h2 style={{ textAlign: "center", padding: "2rem" }}>
          No trips available for this date
        </h2>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="trips-screen">
        <Filters />
        <TripsList restoreTripId={restoreTripId} />
      </div>
    </>
  );
};

export default TripsScreen;
