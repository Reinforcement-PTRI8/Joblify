import React, { useState } from 'react';


const Application = ({ id, firstName, lastName, email }) => {
  return (
    <div className="home-page">
      <div id='home-page-info'>
        <h2>{`${firstName} Applications`}</h2>
      </div>
    </div>
  )
}

export default Application;