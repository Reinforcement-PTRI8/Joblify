import React, { useState, useEffect } from 'react';
import {Route, Routes, Link, Navigate} from "react-router-dom";
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import Application from './pages/Application';
import NavBar from './components/NavBar';

import './styles/main.css';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [id, setId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const verifyLogin = async() => {
      const response = await fetch('/auth/verify');
      const data = await response.json();
      const { user } = data;

      console.log('verifyUser: ', user);
      if (user) {
        setLoggedIn(true);
        setId(user.id);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
      }

    };

    useEffect(() => {
      verifyLogin();
    }, []);

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
                    <Route path='/home' element={<Home
                      id={id}
                      firstName={firstName}
                      lastName={lastName}
                      email={email}/>}
                      />
                      <Route path='/applications' element={<Application
                      id={id}
                      firstName={firstName}
                      lastName={lastName}
                      email={email}/>}
                      />
                  </Routes>
                </>
            }/>
          }
        </Routes>
      </div>
    );
};

export default App;