import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../styles/main.css';
import '../styles/home.css';


const JobEntries = ({ description1, description2, description3, setDescription1, setDescription2, setDescription3, generateSuggestions }) => {
    return (
        <div className="url-container">
            <h4 id="login-text">Enter Job Descriptions Here. Max 3</h4>
            <TextField name="first_job" label="First Link" value={description1} onChange={(event) => setDescription1(event.target.value)} />
            <TextField name="second_job" label="Second Link" value={description2} onChange={(event) => setDescription2(event.target.value)} />
            <TextField name="third_job" label="Third Link" value={description3} onChange={(event) => setDescription3(event.target.value)} />

            <Button onClick={generateSuggestions} variant="contained" id='auth-btn'>Get Suggestions!</Button>
    </div>
    );
};

export default JobEntries;