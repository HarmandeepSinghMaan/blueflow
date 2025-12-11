import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api/client";
import "./login.css"; // <-- custom CSS

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      const token = res?.data?.data?.token;
      if (!token) throw new Error("Missing token");

      setAuthToken(token);
      dispatch(setCredentials({ token, user: { email: data.email } }));

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            {...register("email", { required: true })}
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            {...register("password", { required: true })}
          />

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
