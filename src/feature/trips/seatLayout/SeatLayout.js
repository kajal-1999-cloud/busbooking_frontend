import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
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

const SEAT_DATA = {
  upperDeck: {
    seats: [
      { seatNumber: "U1", gender: null, row: 1, column: 1, price: 300 },
      { seatNumber: "U4", gender: "F", row: 1, column: 2, price: 350 },
      { seatNumber: "U7", gender: null, row: 1, column: 3, price: 300 },
      { seatNumber: "U10", gender: "M", row: 1, column: 4, price: 320 },
      { seatNumber: "U13", gender: "F", row: 1, column: 5, price: 350 },
      { seatNumber: "U16", gender: null, row: 1, column: 6, price: 320 },
      // { seatNumber: "U19", gender: null, row: 1, column: 7, price: 320 },
      { seatNumber: "U2", gender: null, row: 2, column: 1, price: 300 },
      { seatNumber: "U5", gender: "O", row: 2, column: 2, price: 340 },
      { seatNumber: "U8", gender: null, row: 2, column: 3, price: 350 },
      { seatNumber: "U11", gender: null, row: 2, column: 4, price: 300 },
      { seatNumber: "U14", gender: "M", row: 2, column: 5, price: 350 },
      { seatNumber: "U17", gender: null, row: 2, column: 6, price: 320 },
      // { seatNumber: "U20", gender: null, row: 2, column: 7, price: 320 },

      { seatNumber: "U3", gender: null, row: 3, column: 1, price: 310 },
      { seatNumber: "U6", gender: "F", row: 3, column: 2, price: 300 },
      { seatNumber: "U9", gender: "M", row: 3, column: 3, price: 340 },
      { seatNumber: "U12", gender: null, row: 3, column: 4, price: 320 },
      { seatNumber: "U15", gender: "O", row: 3, column: 5, price: 300 },
      { seatNumber: "U18", gender: "F", row: 3, column: 6, price: 350 },
      // { seatNumber: "U21", gender: "F", row: 3, column: 7, price: 350 },
    ],
  },
  lowerDeck: {
    seats: [
      { seatNumber: "L1", gender: "M", row: 1, column: 1, price: 300 },
      { seatNumber: "L4", gender: "O", row: 1, column: 2, price: 350 },
      { seatNumber: "L7", gender: null, row: 1, column: 3, price: 300 },
      { seatNumber: "L10", gender: null, row: 1, column: 4, price: 320 },
      { seatNumber: "L13", gender: "F", row: 1, column: 5, price: 350 },
      { seatNumber: "L16", gender: null, row: 1, column: 6, price: 320 },
      { seatNumber: "L19", gender: null, row: 1, column: 7, price: 320 },

      { seatNumber: "L2", gender: "F", row: 2, column: 1, price: 300 },
      { seatNumber: "L5", gender: "M", row: 2, column: 2, price: 340 },
      { seatNumber: "L8", gender: null, row: 2, column: 3, price: 350 },
      { seatNumber: "L11", gender: null, row: 2, column: 4, price: 300 },
      { seatNumber: "L14", gender: "O", row: 2, column: 5, price: 350 },
      { seatNumber: "L17", gender: null, row: 2, column: 6, price: 320 },
      // { seatNumber: "L20", gender: null, row: 2, column: 7, price: 320 },

      { seatNumber: "L3", gender: null, row: 3, column: 1, price: 310 },
      { seatNumber: "L6", gender: "F", row: 3, column: 2, price: 300 },
      { seatNumber: "L9", gender: "M", row: 3, column: 3, price: 340 },
      { seatNumber: "L12", gender: null, row: 3, column: 4, price: 320 },
      { seatNumber: "L15", gender: "F", row: 3, column: 5, price: 300 },
      { seatNumber: "L18", gender: null, row: 3, column: 6, price: 350 },
      // { seatNumber: "L21", gender: "F", row: 3, column: 7, price: 350 },
    ],
  },
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
