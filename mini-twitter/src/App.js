import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Content from "./component/Content";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./component/forgotPassword";
import SignUp from "./component/signUp";
import React from "react";
import EmailVerf from "./component/emailVerf";
import AdminPage from "./component/AdminPage";
import UserPage from "./component/UserPage";
import ChatPage from "./component/ChatPage";

function App() {
  return (
    <>
      {false && <AdminPage />}
      {false && <ChatPage />}
      {true && <UserPage />}
      {false && (
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/emailVerf" element={<EmailVerf />} />
        </Routes>
      )}
    </>
  );
}

export default App;
