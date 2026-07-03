import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/Header/Header";
import Spinner from "../../utlis/Spiner";
import request from "../../network/request";
import Endpoints from "../../network/endpoints";
import { showError } from "../../utils/toast";
import "./styles/MyBookings.scss";

const formatEpoch = (epoch) => {
  const ts = Number(epoch);
  const ms = ts > 1e12 ? ts : ts * 1000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (epoch) => {
  const ts = Number(epoch);
  const ms = ts > 1e12 ? ts : ts * 1000;
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login", { state: { from: "/my-bookings" } });
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      const { success, data } = await request({
        url: Endpoints.myBookings,
        method: "GET",
      });

      if (success) {
        setBookings(data.bookings || []);
      } else {
        showError(data || "Failed to load bookings");
        if (String(data).toLowerCase().includes("authenticated")) {
          navigate("/login", { state: { from: "/my-bookings" } });
        }
      }
      setLoading(false);
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="my-bookings-page">
      <Header />
      <main className="my-bookings-page__main">
        <h1 className="my-bookings-page__title">My Bookings</h1>

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <div className="my-bookings-empty">
            <p>You have no bookings yet.</p>
            <button
              type="button"
              className="my-bookings-empty__btn"
              onClick={() => navigate("/")}
            >
              Book a Bus
            </button>
          </div>
        ) : (
          <ul className="my-bookings-list">
            {bookings.map((booking) => (
              <li key={booking.bookingId} className="booking-card">
                <div className="booking-card__route">
                  <div>
                    <span className="booking-card__label">From</span>
                    <p className="booking-card__city">
                      {booking.trip?.sourceCity || "—"}
                    </p>
                    <span className="booking-card__sub">
                      {booking.trip?.sourceState}
                    </span>
                  </div>
                  <span className="booking-card__arrow">→</span>
                  <div>
                    <span className="booking-card__label">To</span>
                    <p className="booking-card__city">
                      {booking.trip?.destinationCity || "—"}
                    </p>
                    <span className="booking-card__sub">
                      {booking.trip?.destinationState}
                    </span>
                  </div>
                </div>

                <div className="booking-card__meta">
                  <div>
                    <span className="booking-card__label">Bus</span>
                    <p>{booking.trip?.busPartner || "—"}</p>
                    <span className="booking-card__sub">
                      {booking.trip?.busType}
                    </span>
                  </div>
                  <div>
                    <span className="booking-card__label">Journey</span>
                    <p>
                      {booking.trip?.departureTime
                        ? `${formatEpoch(booking.trip.departureTime)} · ${formatTime(booking.trip.departureTime)}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="booking-card__label">Booked on</span>
                    <p>{formatEpoch(booking.bookingTime)}</p>
                  </div>
                </div>

                <div className="booking-card__seats">
                  <span className="booking-card__label">Seats</span>
                  <div className="booking-card__seat-tags">
                    {booking.seatsInfo?.map((seat) => (
                      <span key={seat.seatNumber} className="booking-card__seat">
                        {seat.seatNumber} · {seat.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="booking-card__footer">
                  <span className="booking-card__amount">
                    ₹ {booking.totalPaid || 0}
                  </span>
                  <span className="booking-card__contact">
                    {booking.pocDetails?.email}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
