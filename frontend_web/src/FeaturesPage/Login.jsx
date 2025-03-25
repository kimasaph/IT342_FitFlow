import React, { useState } from "react";
import account1 from "../Images/account-1.png";
import apple1 from "../Images/apple-1.png"; // Fixed path
import facebook11 from "../Images/fb-1.png"; // Fixed path
import google2 from "../Images/google-2.png"; // Fixed path
import line1 from "../Images/Line 1.png";
import line2 from "../Images/Line 2.png"; 
import padlock1 from "../Images/padlock-1.png";
import screenshot20240828At100419PmRemovebgPreview1 from "../Images/Define.png"; 
import screenshot20250320At84459AmRemovebgPreview1 from "../Images/FitFlowLogo.png"; 
import screenshot20250320At113953AmRemovebgPreview1 from "../Images/FitflowWord.png";
import "../FeaturesPage/CSS/Login.css";

export const DesktopLoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Details:", { emailOrPhone, password, rememberMe });
    // Add your login logic here
  };

  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0 }}>
      <div className="desktop-login-page">
        <form onSubmit={handleSubmit} className="frame-wrapper">
          <div className="frame">
            <div className="overlap">
              <div className="div">
                <div className="text-wrapper">Or Login With:</div>
                <img className="facebook" alt="Facebook" src={facebook11} />
                <img className="apple" alt="Apple" src={apple1} />
                <img className="google" alt="Google" src={google2} />
              </div>
              <div className="frame-2">
                <img
                  className="screenshot"
                  alt="Screenshot"
                  src={screenshot20250320At84459AmRemovebgPreview1}
                />
                <div className="group">
                  <img className="line" alt="Line" src={line2} />
                  <img className="padlock" alt="Padlock" src={padlock1} />
                  <input
                    type="password"
                    className="text-wrapper-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-wrapper-3">Forgot Password?</div>
                <div className="group-2">
                  <img className="img" alt="Line" src={line1} />
                  <div className="overlap-group">
                    <input
                      type="text"
                      className="text-wrapper-4"
                      placeholder="Email/Phone Number"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                    />
                    <img className="account" alt="Account" src={account1} />
                  </div>
                </div>
                <div className="overlap-wrapper">
                  <div className="overlap-2">
                    <button type="submit" className="rectangle">
                      <div className="text-wrapper-5">Login</div>
                    </button>
                  </div>
                </div>
                <p className="welcome-back-enter">
                  Welcome back!&nbsp;&nbsp;
                  <br />
                  Enter your login details.
                </p>
                <div className="overlap-3">
                  <label>
                    <input
                      type="checkbox"
                      className="rectangle-2"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-wrapper-6">Remember Me</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="frame-3">
              <div className="overlap-4">
                <img
                  className="screenshot-2"
                  alt="Screenshot"
                  src={screenshot20240828At100419PmRemovebgPreview1}
                />
                <img
                  className="screenshot-3"
                  alt="Screenshot"
                  src={screenshot20250320At113953AmRemovebgPreview1}
                />
              </div>
              <div className="div-wrapper">
                <div className="text-wrapper-7">Login</div>
              </div>
              <div className="text-wrapper-8">Sign Up</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};