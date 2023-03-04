import React, { useState } from 'react';
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import '../styles/main.css';

const NavBar = ({ setLoggedIn }) => {

    const logout = async() => {
      await fetch('/user/logout');
      setLoggedIn(false);
    };

    const menuItems = [ "Home", "Application Tracker", 'Profile'];
    const menuRoutes = ["/home", "/applications", "/profile"];

    const menuBtns = menuItems.map((ele, i)=> {
        return(
          <Link key={i} className='main-nav-btn' to= {menuRoutes[i]}>
            <Button variant="text">
                {ele}
            </Button>
          </Link>
        );
    });

  return (
    <div className='main-nav'>
      <p className='logo'>Jobl<span>if</span>y</p>
      {menuBtns}
      <Link className='main-nav-btn' to='/' id='logout-link'>
        <Button variant='text' onClick={logout} id='logout-link' sx={{float: 'right'}}>Logout</Button>
      </Link>
    </div>
  );
};

export default NavBar;