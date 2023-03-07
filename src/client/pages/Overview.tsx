import React, { useState } from 'react';


const Overview = ({ id, firstName, lastName, email }) => {
  return (
    <div>
      <div>{`Application, ${firstName}`}</div>
    </div>
  )
}

export default Overview;