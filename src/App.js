import React from 'react'
import './App.css'
import TopBar from './components/TopBar/TopBar';

//import Header from './components/Header/HeaderBar'
import MainDashboard from './components/Dashboard/MainDashboard'
// import HomePage from './components/Home/HomePage.js'
import HomePage from "./components/Home/HomePage"
import {SignUp} from './components/Home/SignUp'
import {LogIn} from './components/Home/LogIn'
import { BrowserRouter,Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";


function App() {
  return (
 
   <BrowserRouter>
           <TopBar />

      <Routes>
        <Route path="shopAlert/" element={<HomePage />} />

        <Route path="shopAlert/dashboard" element={<MainDashboard />} />
        <Route path="shopAlert/signup" element={<SignUp />} />
        <Route path="shopAlert/login" element={<LogIn />} />
          </Routes>
      {/* </Header> */}
    </BrowserRouter>
  )
}

export default App