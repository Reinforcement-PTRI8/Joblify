import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
    const oauthTest = async() => {
      const url = '/oauth/signup'
      console.log('OAuth Test Button');
      await fetch(url, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(() => console.log('fetch request sent'));
    };

    return (
      <>
        <div>Hello World</div>
        <a href="http://localhost:3000/oauth/signup">Sign up with Google</a>
      </>
    );
};

export default App;