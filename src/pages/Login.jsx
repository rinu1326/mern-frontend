import React, { useState } from "react";
import API from '../utils/api'; // Assuming this is a .js file
import "./AuthForm.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-right">
        <h2>Sign In to Your Account</h2>
        <form onSubmit={handleSubmit}>
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
          <a href="#" className="forgot">
            forgot password?
          </a>
          <button type="submit" className="submit-btn">
            SIGN IN
          </button>
        </form>
      </div>

      <div className="auth-left">
        <h2>Hello Friend!</h2>
        <p>Enter your personal details and start your journey with us</p>
        <button className="switch-btn" onClick={() => navigate("/register")}>
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Login;
