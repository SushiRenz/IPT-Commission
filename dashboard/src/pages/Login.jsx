import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
import "./Login.css";
import Button from '@mui/material/Button';
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLoginBtn() {
    try {
      const response = await axios.post("http://localhost:1337/login", { username, password,});
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="loginPage"> 
        <div className="ring">
            <i></i>
            <i></i>
            <i></i>
        </div>

      <div className="login">
        <h1>Login</h1>
          <input 
            className="inputText"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input 
            className="inputText"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

            <div className="actionButtons">
              <Button variant="contained" onClick={handleLoginBtn}>Signin</Button>

              <Button variant="contained" onClick={handleLoginBtn}>Signup</Button>
            </div>
        </div>
      </div>
  );
}

export default Login;