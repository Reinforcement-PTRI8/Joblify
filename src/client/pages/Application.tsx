import React, { useState } from 'react';


const Application = ({ id, firstName, lastName, email }) => {
  return (
    <div>
      <div>{`Application, ${firstName}`}</div>
    </div>
  )
}

export default Application;