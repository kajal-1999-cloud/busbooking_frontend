import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import styles from "../styles/points-styles.module.scss";
import { useSingleSeatData } from "./Seats";
import { useTripContext } from "../SeatLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { saveBookingContext } from "../../../../utils/bookingContext";

const BoardingDroppingPoints = () => {
  const { tripId } = useTripContext();
  const seatData = useSelector((state) => state.trips.allSelectedSeat);
  const { seats, points } = useSingleSeatData(seatData, tripId);
  const [brPoints, drPoints] = useGetPoints();
  const [boardingPoint, setBoardingPoint] = useState(points?.boardingPoint);
  const [droppingPoint, setDroppingPoint] = useState(points?.droppingPoint);

  useEffect(() => {
    if (points?.boardingPoint) setBoardingPoint(points.boardingPoint);
    if (points?.droppingPoint) setDroppingPoint(points.droppingPoint);
  }, [points]);

  const selectedBoardingPointData = {
    type: "BoardingPoint",
    selectedPoint: boardingPoint,
    setPoint: setBoardingPoint,
  };
  const selectedDropingPointData = {
    type: "DropingPoint",
    selectedPoint: droppingPoint,
    setPoint: setDroppingPoint,
  };

  return (
    <li className={styles.seatLayout_stopPoints}>
      {boardingPoint ? (
        <SelectedPoint {...selectedBoardingPointData} />
      ) : (
        <PointList
          points={brPoints}
          setPoint={setBoardingPoint}
          type="Search Boarding Point"
        />
      )}

      {boardingPoint && droppingPoint && (
        <SelectedPoint {...selectedDropingPointData} />
      )}

      {boardingPoint && !droppingPoint && (
        <PointList
          points={drPoints}
          setPoint={setDroppingPoint}
          type={"Search Dropping Point"}
        />
      )}

      {/* Dummy button */}
      <button style={{ height: "60px" }}></button>
      <BookingButton {...{ boardingPoint, droppingPoint, seats, tripId }} />
    </li>
  );
};

const BookingButton = ({ droppingPoint, boardingPoint, seats, tripId }) => {
  const isDisabled = !(seats?.length && boardingPoint && droppingPoint);
  const tripList = useSelector((state) => state.trips.tripsResponse.trips);
  const { sourceCity, destinationCity } = useSelector((state) => state.search);
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = async () => {
    const expires = new Date(new Date().getTime() + 30 * 60 * 1000);
    const points = { boardingPoint, droppingPoint };
    const tripData = { ...tripList.find((item) => item.tripId === tripId) };
    tripData.sourceCity = sourceCity;
    tripData.destinationCity = destinationCity;
    const singleSeatData = { tripId, seats, points, tripData };

    saveBookingContext({
      returnPath: location.pathname,
      tripId,
      seats,
      points,
      tripData,
      sourceCity,
      destinationCity,
    });

    Cookies.set("selectedSeatData", JSON.stringify(singleSeatData), {
      expires,
      path: "/",
    });
    navigate("/book");
  };

  return (
    <button
      disabled={isDisabled}
      className={styles.bookingButton}
      style={{
        backgroundColor: isDisabled ? "hsl(0, 0%, 82%)" : "hsl(4, 65%, 61%)",
      }}
      onClick={handleClick}
    >
      {!seats?.length ? (
        "Select seat to continue"
      ) : (
        <ButtonActive selectedSeats={seats ? seats : []} />
      )}
    </button>
  );
};

const ButtonActive = ({ selectedSeats }) => (
  <div className={styles.activeButton}>
    <span className={styles.totalPrice}>
      ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0)}
    </span>
    <p className={styles.selectedSeats}>
      <span>{selectedSeats.map((seat) => seat.seatNumber).join(", ")}</span>
      <span style={{ fontSize: ".7rem" }}>selected Seats</span>
    </p>
    <span>Continue</span>
  </div>
);

const SelectedPoint = ({ setPoint, type, selectedPoint }) => {
  const { title, directions, arrivalTime } = selectedPoint;
  return (
    <div className={styles.selectedPointCard}>
      <div>
        <p>{type}</p>
        <h4>{title}</h4>
        <p>{arrivalTime}</p>
        <span style={{ fontSize: ".67rem" }}>{directions}</span>
      </div>
      <button onClick={() => setPoint("")}>Change</button>
    </div>
  );
};

const useGetPoints = () => {
  const { boardingPoints, droppingPoints } = useTripContext();

  const bdPoints = useSelector(
    (state) => state.trips.tripsResponse.boardingPoints
  );
  const drPoints = useSelector(
    (state) => state.trips.tripsResponse.dropingPoints
  );
  return [
    boardingPoints.map((p) => {
      const date = new Date(p.arrivalTime * 1000);
      const arrivalTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const cityStop = bdPoints.find((item) => item.stopId === p.stopId);
      return {
        ...cityStop,
        ...p,
        stopId: p.stopId,
        arrivalTime,
      };
    }),
    droppingPoints.map((p) => {
      const date = new Date(p.arrivalTime * 1000);
      const arrivalTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      const cityStop = drPoints.find((item) => item.stopId === p.stopId);
      return {
        ...cityStop,
        ...p,
        stopId: p.stopId,
        arrivalTime,
      };
    }),
  ];
};

const PointList = ({ type, points, setPoint }) => {
  const [searchStr, setSearchStr] = useState("");
  const filteredPoints = points.filter((point) => {
    return point.title
      .toLocaleLowerCase()
      .includes(searchStr.toLocaleLowerCase());
  });

  return (
    <div className={styles.pointsCard}>
      <SearchBar type={type} {...{ setSearchStr, searchStr }} />
      <ul className={styles.pointsListContainer}>
        {filteredPoints.map((point, index) => (
          <li key={index} className={styles.singlePointContainer}>
            <div className={styles.singlePoint}>
              <input type="checkbox" onClick={() => setPoint(point)} />
              <div>
                <p onClick={() => setPoint(point)}>{point.title}</p>
                <span className={styles.subContent}>{point.directions}</span>
              </div>
            </div>
            <span>{point.arrivalTime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
const SearchBar = ({ type, setSearchStr, searchStr }) => {
  return (
    <p className={styles.pointSearchBar} style={{ position: "relative" }}>
      <FaSearch
        style={{
          position: "absolute",
          left: "10px",
          top: "10px",
          color: "hsl(4, 65%, 73%)",
        }}
      />
      <input
        type="text"
        placeholder={type}
        value={searchStr}
        onChange={({ target }) => setSearchStr(target.value)}
      />
    </p>
  );
};

export default BoardingDroppingPoints;
