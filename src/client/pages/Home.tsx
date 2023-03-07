import React, { useState } from 'react';
import DocumentDisplay from '../components/DocumentDisplay';

import '../styles/main.css';
import '../styles/home.css';

const Home = ({ id, firstName, lastName, email }) => {
  return (
    <div className="home-page">
      <div id='home-page-info'>
        <h2>{`Welcome Back, ${firstName}!`}</h2>
      </div>
      <DocumentDisplay/>
    </div>
  );
}

export default Home;