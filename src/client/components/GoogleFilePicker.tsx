import React from 'react';
import useDrivePicker from 'react-google-drive-picker';
import Button from '@mui/material/Button';

const GoogleFilePicker = ({ setDocument, setDocumentURL }) => {

  const [openPicker, authResponse] = useDrivePicker();

  const GOOGLE_CLIENT_ID: string = typeof process.env.GOOGLE_CLIENT_ID === 'string' ? process.env.GOOGLE_CLIENT_ID : 'N/A';
  const GOOGLE_API_KEY: string = typeof process.env.GOOGLE_API_KEY === 'string' ? process.env.GOOGLE_API_KEY : 'N/A';

  const handleOpenPicker = () => {
    openPicker({
      clientId: GOOGLE_CLIENT_ID,
      developerKey: GOOGLE_API_KEY,
      viewId: 'DOCS',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === 'cancel') console.log('Cancelled');
        console.log(data);

        const url = data.docs[0].url;
        const shareUrl = url.replace('drive_web', 'sharing');

        setDocument(data.docs[0].id);
        setDocumentURL(shareUrl);
      },
    });
  };

  return (
    <div> 
      <Button variant='contained' onClick={() => handleOpenPicker()}>GOOGLE DRIVE</Button>
    </div>
  );
};

export default GoogleFilePicker;