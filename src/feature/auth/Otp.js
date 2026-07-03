import "./Sigmup.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Endpoints from "../../network/endpoints";
import cookie from "js-cookie";
import { showError, showSuccess } from "../../utils/toast";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifing, setIsVerifing] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      email: e.target["email"].value,
    };
    let url = Endpoints.getOtp;
    if (isVerifing) {
      payLoad.otp = e.target["otp"].value;
      url = Endpoints.verifyOtp;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),
      });

      if (res.status === 200 && isVerifing) {
        const expires = new Date(new Date().getTime() + 30 * 60 * 1000);
        cookie.set("email", payLoad.email, { expires });
        showSuccess("OTP verified successfully");
        navigate("/Signup", { state: { from: location.state?.from } });
        return;
      }

      if (res.status === 200 && !isVerifing) {
        setIsVerifing(true);
        showSuccess("OTP sent to your email");
        return;
      }

      const data = await res.json().catch(() => ({}));
      showError(data?.message || "OTP request failed. Please try again.");
    } catch {
      showError("OTP request failed. Please try again.");
    }
  };

  return (
    <div className="signup-form">
      <form onSubmit={handelSubmit}>
        <p className="register-heading">Register</p>
        <div className="form-inner">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            id="email"
            required
          />
          {isVerifing && (
            <>
              <label htmlFor="otp">Otp</label>
              <input
                type="number"
                placeholder="Enter The Otp"
                name="otp"
                id="otp"
                required
              />
            </>
          )}
          {isVerifing ? (
            <button id="verfiy-otp" className="signup-btn">
              Verify
            </button>
          ) : (
            <button className="signup-btn">Get Otp</button>
          )}
        </div>
        <p>
          Already have an acount ?{" "}
          <span
            onClick={() =>
              navigate("/login", { state: { from: location.state?.from } })
            }
          >
            Login Now
          </span>
        </p>
      </form>
    </div>
  );
};

export default Otp;
