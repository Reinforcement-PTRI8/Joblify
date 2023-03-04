import React, { useState } from 'react';
import DocumentEditor from '../components/DocumentEditor';

import '../styles/main.css';
import '../styles/login.css';
import '../styles/home.css';

const Home = ({ id, firstName, lastName, email }) => {
  return (
    <div className="home-page">
      <div id='room-page-info'>
        <h2>{`Welcome Back, ${firstName}!`}</h2>
      </div>
      <DocumentEditor/>
    </div>
  );
}

export default Home;