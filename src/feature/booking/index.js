import BookingUI from "./BookingUI";
import BookingMobileUi from "./BookingMobileUI.js";
import Header from "../../components/Header/Header.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import request from "../../network/request.js";
import Endpoints from "../../network/endpoints.js";
import LoginPage from "../auth/LoginPage.js";
import { showError, showSuccess } from "../../utils/toast";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()} ${date.toLocaleString("en-US", {
    month: "short",
  })} ${date.getFullYear()}`;
};

const BookingScreen = () => {
  const navigate = useNavigate();
  const cookieData =
    Cookies.get("selectedSeatData") &&
    JSON.parse(Cookies.get("selectedSeatData"));
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  if (cookieData) {
    const busFare = cookieData?.seats?.reduce(
      (total, item) => total + item.price,
      0
    );
    const gstAmount = busFare * 0.18;
    const totalFare = busFare + gstAmount;
    cookieData.busFare = busFare;
    cookieData.gstAmount = gstAmount;
    cookieData.totalFare = totalFare;
    cookieData.assuredCharge = 100;
    cookieData.departureDate = formatDate(cookieData.tripData.departureTime);
    cookieData.arrivalDate = formatDate(cookieData.tripData.arrivalTime);
  }

  useEffect(() => {
    if (!cookieData) {
      navigate("/");
    }
  }, [cookieData, navigate]);

  if (!cookieData) {
    return;
  }

  if (!token) {
    return (
      <>
        <Header />
        <LoginPage />
      </>
    );
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const phoneNumber = form.phoneNumber.value;
    const payLoad = {
      tripId: cookieData?.tripId,
      boardingPointId: cookieData?.points?.boardingPoint?.stopId,
      droppingPointId: cookieData?.points?.droppingPoint?.stopId,
      pocDetails: {
        phoneNumber,
        email,
      },
      seatsInfo: [],
    };

    cookieData?.seats?.forEach((seatnum) => {
      let seat = seatnum.seatNumber;
      payLoad.seatsInfo.push({
        seatNumber: seat,
        name: form[`${seat}_name`]?.value,
        gender: form[`${seat}_gender`]?.value,
        age: Number(form[`${seat}_age`]?.value),
      });
    });

    try {
      setLoading(true);
      const { success, data } = await request({
        url: Endpoints.booking,
        method: "post",
        data: payLoad,
      });
      if (success) {
        showSuccess(data?.message || "Booking successful");
        Cookies.set("userEmail", email, { expires: 1 });
        navigate("/my-bookings");
      } else {
        showError(data || "Booking failed. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <div className="booking-desktop">
        <Header />
        <BookingUI
          selectedSeatsData={cookieData}
          handelSubmit={handelSubmit}
          loading={loading}
        />
      </div>
      <div className="booking-mobile">
        <Header />
        <BookingMobileUi
          selectedSeatsData={cookieData}
          handelSubmit={handelSubmit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default BookingScreen;
