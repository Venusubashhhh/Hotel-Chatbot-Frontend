import React, { useState } from "react";
import "./LoginPage.scss";
import Person from "../../assets/Icons/Person";
function LoginPage() {
  const [mail, setmail] = useState("");
  return (
    <div className="loginpage-container">
      <div className="form sign_in">
        <form action="#">
          <input type="email" placeholder="Email" />
          <span className="span-component">Login In with Mail Account</span>

          <button className="login-button">Login</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-pannel overlay-right">
            <h1>Login to the application</h1>
            <p className="login-text">
              To start accessing our services for booking the hotels based on
              the users requirement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
