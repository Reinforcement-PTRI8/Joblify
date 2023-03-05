import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../styles/main.css';
import '../styles/home.css';


const JobEntries = ({ url1, url2, url3, setUrl1, setUrl2, setUrl3, generateSuggestions }) => {
    return (
        <div className="url-container">
            <h4 id="login-text">Enter Job URLs Here. Max 3</h4>
            <TextField name="first_job" label="First Link" value={url1} onChange={(event) => setUrl1(event.target.value)} />
            <TextField name="second_job" label="Second Link" value={url2} onChange={(event) => setUrl2(event.target.value)} />
            <TextField name="third_job" label="Third Link" value={url3} onChange={(event) => setUrl3(event.target.value)} />

            <Button onClick={generateSuggestions} variant="contained" id='auth-btn'>Get Suggestions!</Button>
    </div>
    );
};

export default JobEntries;