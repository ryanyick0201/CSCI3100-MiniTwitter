/** App - Integrate different routes as a whole app
 * PROGRAMMER: Li, Hang Chi (SID: 1155142983) for pages before logging in
 *             Choi, Man Wai (SID: 1155159354) for the remaining
 * CALLING SEQUENCE: App() IS_COMPONENT_OF "./index.js"
 * PURPOSE: Integrate before-log-in page, user page and admin page into one whole app
 * ALGORITHM: "logInAs" state determines if the actor is logged in as "user" or "admin",
 *            setLogInAs set "logInAs" state after login action in <Content/> or <ForgotPassword/>
 *            Render <UserPage/> if logInAs == "user", or render <AdminPage/> if logInAs == "admin"
 *            This prevent users to view AdminPage by changing the URL, or admin viewing UserPage by doing the same thing.
 */
import "./App.css";
import Content from "./component/Content";
import { Routes, Route } from "react-router-dom";
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
        /* 
          Before logging in
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
