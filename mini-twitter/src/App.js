import "./App.css";
//import 'bootstrap/dist/css/bootstrap.min.css';
import Content from "./component/Content";
import { Routes, Route, useLocation } from "react-router-dom";
import ForgotPassword from "./component/forgotPassword";
import SignUp from "./component/signUp";
import React from "react";
import EmailVerf from "./component/emailVerf";
import UserPage from "./component/UserPage.js";
import AdminPage from "./component/AdminPage.js";

import { useState } from "react";

const loggedin = () => {
  var status = false;
  var fetch_result = "";
  const url = "http://" + window.location.hostname + ":3000/getSessionUsername";
  fetch(url, { mode: "cors" })
    .then((res) => res.json())
    .then((obj) => (fetch_result = !!obj.result));

  status = fetch_result == sessionStorage.getItem("username");
  return status;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Content setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/forgot_password"
          element={<ForgotPassword setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/emailVerf" element={<EmailVerf />} />
      </Routes>
      {isLoggedIn && <UserPage />}
      <Routes>
        <Route
          path="/adminHome"
          element={<AdminPage setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </>
  );
}

export default App;
