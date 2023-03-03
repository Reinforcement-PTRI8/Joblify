import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
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
      if (cookies.includes('jwt')) setLoggedIn(true);
    }, []);

    return (
      <div id='main-page'>
        <Routes>
          <Route path='/' element={<Login setLoggedIn={setLoggedIn}/>}/>
          {loggedIn && 
            <Route 
              path='/home/*' 
              element={
                <>
                  <NavBar/>
                  <Routes>
                    <Route path='/' element={<Home/>}/>
                  </Routes>
                </>
            }/>
            
          } 
        </Routes>     
      </div>
    );
};

export default App;