import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
    })
  };

  const login = async() => {
    const response = await fetch('/users/login', {
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
    })
  };

  const loginDetails = (
    <div className="auth-container details-container">
      <h2 id="login-text">Log in to Joblify</h2>
      <TextField name="email" label="email" onChange={(event) => setEmail(event.target.value)} />
      <TextField name="password" type='password' label="Password" onChange={(event) => setPassword(event.target.value)} />
      
      <Button onClick={login} variant="contained" id='auth-btn'>Login</Button>
      
      <p>{'Don\'t have an account?'} <span className='switch-auth' onClick={() => setSignup(true)}>Click here!</span></p>
    </div>
  );

  const signupDetails = (
    <div className="auth-container details-container">
      <h2 id="login-text">Sign up for Joblify</h2>
      <TextField name="first_name" label="First Name" onChange={(event) => setFirstName(event.target.value)} />
      <TextField name="last_name" label="Last Name" onChange={(event) => setLastName(event.target.value)} />
      <TextField name="email" label="email" onChange={(event) => setEmail(event.target.value)} />
      <TextField name="password" type='password' label="Password" onChange={(event) => setPassword(event.target.value)} />
      <TextField name="occupation" label="Occupation" onChange={(event) => setOccupation(event.target.value)} />
      
      <Button onClick={signUp} variant="contained" id='auth-btn'>Login</Button>
      
      <p>{'Already have an account?'} <span className='switch-auth' onClick={() => setSignup(false)}>Click here!</span></p>
    </div>
  );

  return (
    <div> 
      <p className='logo' id='main-logo'>Job<span>lif</span>y</p>
      {signup ? signupDetails : loginDetails}
      <a href="http://localhost:3000/oauth/signup">Sign up with Google</a>
    </div>
  )
}

export default Login;