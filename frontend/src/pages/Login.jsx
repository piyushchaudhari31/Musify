import React, { useState } from "react";
import '../pages/login.css'
import toast from 'react-hot-toast'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    
  };
  const url = "https://musify-mxwi.onrender.com"

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${url}/api/auth/login`, loginData, {withCredentials:true});
      

      const role = response.data.user.role;
      if(role === "artist"){
        navigate("/artist/dashboard")
        toast.success("Login Successfully with artist")
      }
      else{
        navigate('/');
        toast.success("Login Successfully with user");
        

      }
      
    } catch (error) {
      toast.error(error.response.data.message);
    }

  };

  const handleGoogle = () => {
    window.location.href=`${url}/api/auth/google`
    navigate('/')
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
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
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogle}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Continue with Google
          </button>

          <p className="register-link">
            You haven’t an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
