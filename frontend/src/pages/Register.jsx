import React, { useState } from "react";
import "./Register.css";
import axios from 'axios'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

function Register() {

  const [length , setlength] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
    role: "user",
  });

  const url = "https://musify-mxwi.onrender.com"
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fullName fields
    if (name === "firstName" || name === "lastName") {
      setFormData({
        ...formData,
        fullName: {
          ...formData.fullName,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Password length validation
    if (name === "password") {
      if (value.length > 6) {
        setlength("Password must be at least 6 characters");
      } else {
        setlength("");
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${url}/api/auth/register`, formData, {withCredentials:true});
      toast.success("Register Successfully");
      navigate('/login');
    } catch (error) {
      if (error.response.data.error) {
        setlength(error.response.data.error[0].msg);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleGoogle = () => {
    window.location.href = `${url}/api/auth/google`
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Register Your Account</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.fullName.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.fullName.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <p className="Password_length">{length}</p>

          <div className="form-group role">
            <label>Role</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={formData.role === "artist"}
                  onChange={handleChange}
                />
                Artist
              </label>
            </div>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="google-btn" onClick={handleGoogle}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Continue with Google
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
