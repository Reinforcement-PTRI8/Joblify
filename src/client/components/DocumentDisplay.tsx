import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import SelectedDocument from './SelectedDocument';
import GoogleFilePicker from './GoogleFilePicker';
import JobEntries from './JobEntries';

const DocumentDisplay = () => {
  const [document, setDocument] = useState('');
  const [documentURL, setDocumentURL] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [url3, setUrl3] = useState('');

  const clearUrls = async () => {
    setUrl1('');
    setUrl2('');
    setUrl3('');
  };

  const generateSuggestions = async() => {
    //Function to send request to backend openAI endpoint
    await clearUrls();
  };

  const parseGoogleDoc = async() => {
    if (!document.length) return;
    await fetch(`/oauth/${document}`);
  };

  console.log('Document id: ', document);
  return (
    <>
        <div className='doc-editor'>
            <h1 className = 'file-manager'> Load a File for Viewing</h1>
            <GoogleFilePicker setDocument={setDocument} setDocumentURL={setDocumentURL}/>
            <Button variant='contained' onClick={parseGoogleDoc}>Parse Doc</Button>
        </div>
        {documentURL &&
        <div className='docArea'>
          <SelectedDocument
            document={document}
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