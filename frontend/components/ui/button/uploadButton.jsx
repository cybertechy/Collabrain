import { useState } from 'react';
import { CameraAlt } from '@mui/icons-material';


const UploadButton = ({ onUpload }) => {
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        try {
            // Call the onUpload function and pass the file
            // const imageUrl = await onUpload(file);
            const temporaryUrl = URL.createObjectURL(file);
            // Update the UI with the uploaded image URL
            setUploadedImage(temporaryUrl);
            // const imageUrl = await onUpload(file);
        } catch (error) {
            // Handle any errors that occur during the upload
            console.error('Image upload error:', error);
            // You can also provide user feedback here
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            <label htmlFor="file-upload" className="flex text-primary flex-col justify-center items-center w-32 h-32 border-2 border-tertiary border-opacity-30 rounded-full cursor-pointer hover:bg-aliceBlue">
                {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded" className="hover:" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                    <>
                        <CameraAlt style={{ fontSize: '4rem' }} />
                        <span className="mt-2 text-center">UPLOAD</span>
                    </>
                )}
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
            </label>
        </div>
    );
};
export default UploadButton;
