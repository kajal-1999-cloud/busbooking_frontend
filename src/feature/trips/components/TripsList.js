import "../styles/TripList.scss";

import { formatDate, formatTime } from "./formatDatetime";
import { TripDetails } from "./TripsDetails";
import { useSelector } from "react-redux";
import { tripsSelector, allTripsSelector } from "../redux/selectors";
import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import SeatLayout from "../seatLayout/SeatLayout.js";

export default function TripsList({ restoreTripId }) {
  const tripsList = useSelector(tripsSelector);
  const allTrips = useSelector(allTripsSelector);
  const { source, destination } = useParams();

  const hasTrips = allTrips.length > 0;
  const hasFilteredTrips = tripsList?.filteredTrips?.length > 0;

  return (
    <div className="trips container ">
      {hasFilteredTrips ? (
        tripsList.filteredTrips.map((trip) => (
          <SingleTrip
            key={trip.tripId}
            {...{ trip, source, destination, restoreTripId }}
          />
        ))
      ) : (
        <p>
          {hasTrips
            ? "No trips match your current filters. Try clearing filters."
            : "No Trips Available for this date"}
        </p>
      )}
    </div>
  );
}

const SingleTrip = (props) => {
  const { trip, source, destination, restoreTripId } = props;
  const [showSeat, setShowSeat] = useState(trip.tripId === restoreTripId);
  const tripRef = useRef(null);

  useEffect(() => {
    if (trip.tripId === restoreTripId) {
      setShowSeat(true);
      tripRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [restoreTripId, trip.tripId]);

  return (
    <>
      <div ref={tripRef} key={trip.tripId} className="tripsList">
        <div className="TripContainer">
          <div className="leftWrapper">
            <div className="upperItems">
              <div className="flex tripInfo">
                <div className="NameAndType">
                  <h5>{trip.busPartner}</h5>
                  <p className="grey">{trip.busType}</p>
                </div>
                <div className="timeInfo flex">
                  <div className="departureData">
                    <p className="grey">{formatDate(trip.departureTime)}</p>
                    <span>{formatTime(trip.departureTime)}</span>
                    <p className="grey">{source}</p>
                  </div>
                  <div className="duration flex grey">
                    - - -
                    <p>
                      {calculateDuration(trip.departureTime, trip.arrivalTime)}
                    </p>
                    - - -
                  </div>
                  <div className="arrivalData">
                    <p className="grey">{formatDate(trip.arrivalTime)}</p>
                    <span>{formatTime(trip.arrivalTime)}</span>
                    <p className="grey">{destination}</p>
                  </div>
                </div>
              </div>
            </div>
            <TripDetails trip={trip} />
          </div>
          <div className="rightWrapper">
            <div className="text-end">
              <p className="grey">Starting At</p>
              <span>₹ {trip.minPrice}</span>
            </div>
            <div className="text-end">
              <button
                id="show-seat"
                onClick={() => setShowSeat((prev) => !prev)}
                className="showSeat"
              >
                Show Seat
              </button>
              <p className="grey seats-available">
                {trip.availableSeats} Seats Available
              </p>
            </div>
          </div>
        </div>
        {showSeat && <SeatLayout trip={trip} />}
      </div>
    </>
  );
};

//  Total Duration
const calculateDuration = (departureTime, arrivalTime) => {
  const durationMs = (arrivalTime - departureTime) * 1000;
  const totalMinutes = Math.floor(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format hours and minutes
  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}.${formattedMinutes} Hrs`;
};
