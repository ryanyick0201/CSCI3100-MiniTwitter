import "./App.css";
import Content from "./component/Content";
import { Routes, Route, useLocation } from "react-router-dom";
import ForgotPassword from "./component/forgotPassword";
import SignUp from "./component/signUp";
import React from "react";
import EmailVerf from "./component/emailVerf";
import UserPage from "./component/UserPage.js";
import AdminPage from "./component/AdminPage.js";

import { useState } from "react";

function App() {
  // track the access right ("user" || "admin") of the logged-in user
  const [logInAs, setLogInAs] = useState("");

  return (
    <>
      {
        /* Before logging in
         */
        <Routes>
          <Route path="/" element={<Content setLogInAs={setLogInAs} />} />
          <Route
            path="/forgot_password"
            element={<ForgotPassword setLogInAs={setLogInAs} />}
          />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/emailVerf" element={<EmailVerf />} />
        </Routes>
      }

      {
        /* User page, render after logging in as user.
            If unauthorized user tries to view the after-login page by entering the URL,
            he would only see a blank page
        */
        logInAs == "user" && <UserPage />
      }

      {
        /* Admin page, render after logging in as user.
            If unauthorized user tries to view the after-login page by entering the URL,
            he would only see a blank page
        */
        logInAs == "admin" && (
          <Routes>
            <Route
              path="/adminHome"
              element={<AdminPage setLogInAs={setLogInAs} />}
            />
          </Routes>
        )
      }
    </>
  );
}

export default App;
