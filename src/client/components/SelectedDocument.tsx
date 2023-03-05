import React, { useState } from 'react';

import '../styles/home.css';

const SelectedDocument = ({ document, documentURL }) => {
  const [url, setURL] = useState(documentURL);
  
  return (
    <div className="doc-container">
      <h1 className="doc-header">{document.replace(/.*?_/, '').replace(/\.[^/.]+$/, '')}</h1>
      {documentURL && <iframe
        className='iframe'
        src={documentURL} 
        height="1000px"
        width="auto"/>}
    </div>  
  );

}

export default SelectedDocument;