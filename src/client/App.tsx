import React, { useState, useEffect } from 'react';
import {Route, Routes, Link, Navigate} from "react-router-dom";
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import NavBar from './components/NavBar';

import './styles/main.css';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
      const cookies = document.cookie.split(';');
      console.log(cookies)
      for (const cookie of cookies) {
        if (cookie.startsWith('jwt')) setLoggedIn(true);
      };
    }, []);

    console.log(loggedIn);

    return (
      <div id='main-page'>
        <Routes>
          {!loggedIn && <Route path='/' element={<Login setLoggedIn={setLoggedIn}/>}/>}
          {loggedIn && 
            <Route 
              path='/' 
              element={
                <>
                  <NavBar/>
                  <Routes>
                    <Route path='*' element={<Home/>}/>
                  </Routes>
                </>
            }/>
          } 
        </Routes>     
      </div>
    );
};

export default App;