import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
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
              path='/*'
              element={
                <>
                  <NavBar setLoggedIn={setLoggedIn}/>
                  <Routes >
                    <Route path='/home' element={
                      <div id='main-container' style={{flex: 1}}>
                        <Home
                          id={id}
                          firstName={firstName}
                          lastName={lastName}
                          email={email}/>
                      </div>}/>
                    <Route path='/applications' element={
                      <div id='main-container' style={{flex: 1}}>
                        <Application
                          id={id}
                          firstName={firstName}
                          lastName={lastName}
                          email={email}/>
                      </div>}/>
                  </Routes>
                </>
            }/>
          }
        </Routes>
      </div>
    );
};

export default App;