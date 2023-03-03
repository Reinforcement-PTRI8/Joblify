import React, { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import '../styles/login.css';

const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');
  
  const [signup, setSignup] = useState(true);

  const signUp = async() => {
    const response = await fetch('/users/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    if (data.status === 'success') setLoggedIn(true);
  };

  const login = async() => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 'success') setLoggedIn(true);
  };

  const oauthLogin = async() => {
    const response = await axios.get('http://localhost:3000/oauth/signup');
    console.log('OAuth response: ', response);
    setLoggedIn(true);
  }

  const loginDetails = (
    <div className="auth-container details-container">
      <h2 id="login-text">Already have an account? Log in</h2>
      <TextField name="email" label="Email" onChange={(event) => setEmail(event.target.value)} />
      <TextField name="password" type='password' label="Password" onChange={(event) => setPassword(event.target.value)} />
      
      <Button onClick={login} variant="contained" id='auth-btn'>Login</Button>
      <Button onClick={oauthLogin}>Log In With Google</Button>
      <p>{'Don\'t have an account?'} <span className='switch-auth' onClick={() => setSignup(true)}>Click here!</span></p>
    </div>
  );

  const signupDetails = (
    <div className="auth-container details-container">
      <h2 id="login-text">Don't have an account? Sign up today!</h2>
      <TextField name="first_name" label="First Name" onChange={(event) => setFirstName(event.target.value)} />
      <TextField name="last_name" label="Last Name" onChange={(event) => setLastName(event.target.value)} />
      <TextField name="email" label="Email" onChange={(event) => setEmail(event.target.value)} />
      <TextField name="password" type='password' label="Password" onChange={(event) => setPassword(event.target.value)} />
      <TextField name="occupation" label="Occupation" onChange={(event) => setOccupation(event.target.value)} />
      
      <Button onClick={signUp} variant="contained" id='auth-btn'>Sign Up</Button>
      <Button href="http://localhost:3000/oauth/signup">Sign Up With Google</Button>
      <p>{'Already have an account?'} <span className='switch-auth' onClick={() => setSignup(false)}>Click here!</span></p>
    </div>
  );

  return (
    <div> 
      <p className='logo' id='main-logo'>Welcome to Job<span>lif</span>y</p>
      {signup ? signupDetails : loginDetails}
      
    </div>
  )
}

export default Login;