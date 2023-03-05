import React, { useState, useEffect } from 'react';

import '../styles/home.css';

const SelectedDocument = ({ documentId, documentURL }) => {
  const [url, setURL] = useState(documentURL);

  return (
    <div className="doc-container">
      <h1 className="doc-header">{documentId.replace(/.*?_/, '').replace(/\.[^/.]+$/, '')}</h1>
      {documentURL && <iframe
        className='iframe'
        id='iframe'
        src={documentURL} 
        height="1000px"
        width="auto"/>}
    </div>  
  );

}

export default SelectedDocument;