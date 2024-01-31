import { useState } from 'react';
import { CameraAlt } from '@mui/icons-material';

const UploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // You can handle the file upload here
  };

  return (
    <div className="flex justify-center items-center w-full">
      <label htmlFor="file-upload" className="flex text-primary flex-col justify-center items-center w-32 h-32 border-2 border-dashed border-secondary rounded-full cursor-pointer hover:bg-aliceBlue">
        <CameraAlt style={{ fontSize: '4rem' }} />
        <span className="mt-2 text-center">UPLOAD</span>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default UploadButton;
