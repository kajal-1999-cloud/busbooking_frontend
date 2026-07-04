import { Radio } from "antd";
import "./Sigmup.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Endpoints from "./../../network/endpoints";
import request from "../../network/request";
import navigateAfterAuth from "../../utils/navigateAfterAuth";
import { showError, showSuccess } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiMessage";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gender, setGender] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!gender) {
      showError("Please select your gender");
      return;
    }

    const payLoad = {
      fullName: e.target["fullName"].value.trim(),
      gender,
      dob: Number(e.target["dob"].value),
      email: e.target["email"].value.trim(),
      contactNumber: String(e.target["contactNumber"].value),
      password: e.target["password"].value,
    };

    try {
      const res = await fetch(Endpoints.singUp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),
      });

      if (res.status !== 200) {
        const data = await res.json().catch(() => ({}));
        showError(
          getApiErrorMessage(data, "Registration failed. Please try again.")
        );
        return;
      }

      const loginRes = await request({
        url: Endpoints.login,
        method: "POST",
        data: {
          email: payLoad.email,
          password: payLoad.password,
        },
      });

      if (loginRes.success) {
        Cookies.set("token", loginRes.data.token);
        Cookies.set("userEmail", payLoad.email, { expires: 1 });
        showSuccess("Account created successfully");
        navigateAfterAuth(navigate, location.state?.from);
        return;
      }

      showSuccess("Account created. Please login to continue.");
      navigate("/login", { state: { from: location.state?.from } });
    } catch {
      showError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-form">
      <form onSubmit={handelSubmit}>
        <p className="register-heading">Register</p>
        <div className="form-inner">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="fullName"
            id="name"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            id="email"
            required
          />
          <label htmlFor="age">Age</label>
          <input
            type="number"
            placeholder="Enter your age"
            name="dob"
            id="age"
            required
          />
          <Radio.Group value={gender} onChange={(e) => setGender(e.target.value)}>
            <Radio value="M">Male</Radio>
            <Radio value="F">Female</Radio>
          </Radio.Group>
          <label htmlFor="Contact-number">Phone</label>
          <input
            type="number"
            placeholder="Contact number"
            name="contactNumber"
            id="Contact-number"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            required
          />
          <button className="signup-btn">Register</button>
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

export default Signup;
