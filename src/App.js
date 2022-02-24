import React, {useState, useEffect} from 'react';
import './App.css';
import TopBar from './components/TopBar/TopBar';


//import Header from './components/Header/HeaderBar'
import MainDashboard from './components/Dashboard/MainDashboard'
// import HomePage from './components/Home/HomePage.js'
import HomePage from "./components/Home/HomePage"
import {SignUp} from './components/Home/SignUp'
import {LogIn} from './components/Home/LogIn'
import { BrowserRouter,Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import {listSongs} from './graphql/queries'; 


function App() {
  
  const [songs, setSongs] = useState([]);

  useEffect(() =>{
    fetchSongs();

  }, []); //without [] this will call fetchSongs in an infinite loop, so adding [] makes it call fetchSongs only once 
  const fetchSongs = async() => {
    try{
      
      const songData = await API.graphql(graphqlOperation(listSongs)); //get the song database
      const songList = songData.data.listSongs.items;
      console.log('song list', songList);
      setSongs(songList);

    }
    catch (error){
      console.log('error on fetching songs', error);

    }

  }
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