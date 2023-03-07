import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import SelectedDocument from './SelectedDocument';
import GoogleFilePicker from './GoogleFilePicker';
import JobEntries from './JobEntries';
import { getDialogContentTextUtilityClass } from '@mui/material';

declare global {
  interface Window { gapi: any; }
}

const DocumentDisplay = () => {
  const [documentId, setDocumentId] = useState('');
  const [documentURL, setDocumentURL] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [url3, setUrl3] = useState('');

  const GOOGLE_CLIENT_ID: string = typeof process.env.GOOGLE_CLIENT_ID === 'string' ? process.env.GOOGLE_CLIENT_ID : 'N/A';
  const GOOGLE_API_KEY: string = typeof process.env.GOOGLE_API_KEY === 'string' ? process.env.GOOGLE_API_KEY : 'N/A';

  const clearUrls = async () => {
    setUrl1('');
    setUrl2('');
    setUrl3('');
  };

  const generateSuggestions = async() => {
    //Function to send request to backend openAI endpoint
    if (!documentText) return;
    if (!url1 && !url2 && !url3) return;

    const body = {
      resumeText: documentText,
      jobUrls: [url1, url2, url3],
    };

    const response = await axios.post('/suggestions/resume', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: body,
    });

    console.log('Generated Suggestions for resume: ', response);
    await clearUrls();
  };

  const getAccessToken = async() => {
    const response = await fetch('/oauth/getToken');
    const data = await response.json();

    let { access_token } = data;
    if (access_token === undefined) {
      console.log('Getting token with gapi client');

      await window.gapi.load('client', () => {
        window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          clientId: GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/docs/v1/rest'],
          scope: 'https://www.googleapis.com/auth/documents.readonly',
          plugin_name: 'Joblify',
        }).then(() => {
          const user = window.gapi.auth2.getAuthInstance().currentUser.get();
          if (user.hasGrantedScopes('https://www.googleapis.com/auth/documents.readonly')) {
            access_token = user.getAuthResponse().access_token;
          };
        }).catch(err => console.log('Error in gapi client: ', err));
      });
    };

    await fetch('/oauth/storeAccessToken', {
      method: 'PATCH',
      body: JSON.stringify({ access_token })
    });

    console.log('Final access token: ', access_token);
    return access_token;
  };

  const getDocumentContents = async() => {
    if (!documentId) return;

    const access_token = await getAccessToken();
    console.log('Getting document contents: ', documentId, access_token);

    const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const document = await response.json();

    console.log('Document content request result: ', document);

    let resumeContents = '';
    if (document.body) {
      for (let i = 0; i < document.body.content.length; i++) {
        const content = document.body.content[i];

        if (content.paragraph) {
          const { elements } = content.paragraph;
          for (let j = 0; j < elements.length; j++) {
            const element = elements[j];

            if (element.textRun) resumeContents += element.textRun.content;
          };
        }
      };
    };
    
    setDocumentText(resumeContents);
  };

  useEffect(() => {
    if (documentId) getDocumentContents();
  }, [documentId]);

  console.log('Current document text: ', documentText);
  return (
    <>
        <div className='doc-editor'>
            <h1 className = 'file-manager'> Load a File for Viewing</h1>
            <GoogleFilePicker setDocumentId={setDocumentId} setDocumentURL={setDocumentURL}/>
        </div>
        {documentURL &&
        <div className='docArea'>
          <SelectedDocument
            documentId={documentId}
            documentURL={documentURL}/>
          <div className='suggestions-container'>
            <JobEntries
              url1={url1}
              url2={url2}
              url3={url3}
              setUrl1={setUrl1}
              setUrl2={setUrl2}
              setUrl3={setUrl3}
              generateSuggestions={generateSuggestions}/>
            <div>Sugestions Go Here</div>
            <div>Test Element</div>
          </div>    
        </div>} 
    </>
    
  );
}

export default DocumentDisplay;