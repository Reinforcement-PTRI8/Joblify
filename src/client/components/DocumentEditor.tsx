import React, { useState, useEffect } from 'react';

import SelectedDocument from './SelectedDocument';
import GoogleFilePicker from './GoogleFilePicker';

const DocumentEditor = () => {
  const [document, setDocument] = useState('');
  const [documentURL, setDocumentURL] = useState('');
  
  
  console.log(document);
  return (
    <>
        <div className='doc-editor'>
            <h1 className = 'file-manager'> Load a File for Viewing</h1>
            <GoogleFilePicker setDocument={setDocument} setDocumentURL={setDocumentURL}/>
        </div>
        <div className='docArea'>
            {documentURL &&
              <SelectedDocument
                document={document}
                documentURL={documentURL}
              />} 
        </div>
    </>
    
  );
}

export default DocumentEditor;