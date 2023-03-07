import React, { useState } from 'react';


const Home = ({ id, firstName, lastName, email }) => {
  return (
    <div>
      <div>{`Welcome, ${firstName}`}</div>
    </div>
  )
}

export default Home;