
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Navigation from './component/Navigation.js';
import Content from './component/Content';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './component/forgotPassword';
import React from 'react';
//import Footer from './Footer';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Content />}/>
        <Route path="/forgot_password" element={<ForgotPassword />}/>
      </Routes>
    // <div className='App'>
    //   <Content />
    //   <ForgotPassword />
    // </div>
  );
}

export default App;