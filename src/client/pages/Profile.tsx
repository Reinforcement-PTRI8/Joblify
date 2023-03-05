import React, { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../styles/profile.css';
import '../styles/main.css';

const Profile = ({ 
    id, 
    firstName, 
    lastName, 
    email, 
    occupation, 
    setFirstName, 
    setLastName, 
    setEmail,
    setOccupation 
}) => {
    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);
    const [newEmail, setNewEmail] = useState(email);
    const [newOccupation, setNewOccupation] = useState(occupation);

    console.log('Profile component: ', newFirstName, newLastName, newEmail, newOccupation);
    const submitProfileChanges = async() => {
        const pfirst_name = newFirstName.length ? newFirstName : firstName;
        const plast_name = newLastName.length ? newLastName : lastName;
        const pemail = newEmail.length ? newEmail : email;
        const poccupation = newOccupation.length ? newOccupation : occupation;

        const response = await axios.patch(`/users/${id}`, {
            first_name: pfirst_name, 
            last_name: plast_name, 
            email: pemail, 
            occupation: poccupation
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
        });
        
        if (response.status === 200) {
            setFirstName(pfirst_name);
            setLastName(plast_name);
            setEmail(pemail);
            setOccupation(poccupation);
        } else {
            setNewFirstName(firstName);
            setNewLastName(lastName);
            setNewEmail(email);
            setNewOccupation(occupation);
        };
    };

    return (
        <div>
            <div className="profile-container details-container">
                <h2 id="profile-text">Profile Information</h2>
                <TextField name="first_name" label="First Name" value={newFirstName} onChange={(event) => setNewFirstName(event.target.value)} />
                <TextField name="last_name" label="Last Name" value={newLastName} onChange={(event) => setNewLastName(event.target.value)} />
                <TextField name="email" label="Email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} />
                <TextField name="occupation" label="Occupation" value={newOccupation} onChange={(event) => setNewOccupation(event.target.value)} />

                <Button variant="contained" onClick={submitProfileChanges} id='auth-btn'>Submit Changes</Button>
            </div>
        </div>
        
    );
};

export default Profile;