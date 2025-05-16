import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./AuthForm.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
        <button className="switch-btn" onClick={() => navigate("/login")}>
          SIGN IN
        </button>
      </div>

      <div className="auth-right">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
