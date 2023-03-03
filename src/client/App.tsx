import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {Route, Routes, Link, Navigate} from "react-router-dom";
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import NavBar from './components/NavBar';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
      <>
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
      </>
    );
};

export default App;