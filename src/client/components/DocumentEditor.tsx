import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import GoogleFilePicker from './GoogleFilePicker';

const DocumentEditor = () => {

  const [openPicker, setPicker] = useState(false);
  const [document, setDocument] = useState({});
  const [openEditor, setEditor] = useState(true);

  return (
    <div className='doc-editor'>
        <h1 className = 'file-manager'> Load a File for Viewing</h1>
      {openPicker && <GoogleFilePicker setDocument={setDocument} />}
      {openEditor ? 
        <ExpandLess onClick={() => setEditor(false)}/>
        : <ExpandMore onClick={() => setEditor(true)}/>}
    </div>
  );
}

export default DocumentEditor;