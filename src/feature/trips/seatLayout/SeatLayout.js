import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Spinner from "../../../utlis/Spiner";
import SeatHeader from "./components/SeatHeader";
import SeatContent from "./components/SeatContent";
import { useDispatch } from "react-redux";
import styles from "./styles/seat-layout-styles.module.scss";
import { setTripId } from "../redux/slice.js";
import request from "../../../network/request";
import Endpoints from "../../../network/endpoints.js";
import { showError } from "../../../utils/toast";

const TripIdContext = createContext(null);

export const useTripContext = () => {
  return useContext(TripIdContext);
};

const SeatLayout = ({ trip }) => {
  const tripId =
    trip?.tripId?._id || trip?.tripId?.toString?.() || trip?.tripId || "";
  const [isLoading, error, seatData] = useGetSeatData(tripId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tripId) dispatch(setTripId(tripId));
  }, [dispatch, tripId]);

  if (!tripId) {
    return <h1>Invalid trip. Please go back and try again.</h1>;
  }
  if (isLoading) return <Spinner />;
  if (error) return <h1>{error}</h1>;

  return (
    <div className={styles.seatLayout_wrapper}>
      <div className={styles.seatLayout_container}>
        <SeatHeader />
        <TripIdContext.Provider value={trip}>
          <SeatContent seatData={seatData} />
        </TripIdContext.Provider>
      </div>
    </div>
  );
};

//for fetching data from backend
const useGetSeatData = (tripId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, seterror] = useState("");
  const [seatData, setSeatData] = useState({});

  useEffect(() => {
    if (!tripId) {
      seterror("Invalid trip id");
      setIsLoading(false);
      return;
    }

    const getSeatData = async () => {
      setIsLoading(true);
      seterror("");
      const res = await request({
        url: `${Endpoints.seatLayout}?tripId=${encodeURIComponent(tripId)}`,
        method: "GET",
      });

      if (res.success && res.data?.upperDeck && res.data?.lowerDeck) {
        setSeatData(res.data);
        setIsLoading(false);
      } else {
        const message =
          typeof res.data === "string"
            ? res.data
            : res.data?.message || "Failed to load seat layout. Please try again.";
        showError(message);
        seterror(message);
        setIsLoading(false);
      }
    };

    getSeatData();
  }, [tripId]);

  return [isLoading, error, seatData];
};

export default SeatLayout;
