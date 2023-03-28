
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Navigation from './component/Navigation.js';
import Content from './component/Content';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './component/forgotPassword';
import SignUp from './component/signUp'
import React from 'react';
import EmailVerf from './component/emailVerf';
//import Footer from './Footer';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Content />}/>
        <Route path="/forgot_password" element={<ForgotPassword />}/>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/EmailVerf" element={<EmailVerf />}/>
      </Routes>
  );
}

export default App;