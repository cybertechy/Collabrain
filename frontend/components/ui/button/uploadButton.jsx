import { useState,useEffect } from 'react';
import { CameraAlt } from '@mui/icons-material';
import axios from 'axios';

function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        }
    }
    );
}




const UploadButton = ({ onUpload , photo }) => {
    const [uploadedImage, setUploadedImage] = useState(photo?.data );
    
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
    
        try {
            // Call the onUpload function and pass the file
            // const imageUrl = await onUpload(file);
            let Image = URL.createObjectURL(file);
            Image = await convertBase64(file);
            // Update the UI with the uploaded image URL
            setUploadedImage(Image);
            // const imageUrl = await onUpload(file);
            
            if(onUpload) onUpload(Image,file.type);
        } catch (error) {
            // Handle any errors that occur during the upload
            console.error('Image upload error:', error);
            // You can also provide user feedback here
        }
    };

    useEffect(() => {
        if(photo){
            setUploadedImage(photo.data);
        }
    }, [photo]);


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
