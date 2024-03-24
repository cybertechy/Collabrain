import { useState,useEffect } from 'react';
import { CameraAlt } from '@mui/icons-material';
import axios from 'axios';
import { getMedia } from '@/app/utils/storage';
import CircularProgress from '@mui/material/CircularProgress';

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




const UploadButton = ({ onUpload , photo,id, type }) => {
    const [uploadedImage, setUploadedImage] = useState(photo?.data );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (id) {
                setLoading(true);
                try {
                    const fetchedMedia = await getMedia(id, type);
                    if (fetchedMedia && fetchedMedia.data) {
                        setUploadedImage(fetchedMedia.data);
                    }
                } catch (error) {
                    console.error('Error fetching image:', error);
                } finally {
                    setLoading(false);
                }
            } else if (photo) {
                setUploadedImage(photo.data);
            }
        };

        fetchImage();
    }, [id, photo, type]);
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            let image = URL.createObjectURL(file);
            image = await convertBase64(file);
            setUploadedImage(image);
            if (onUpload) onUpload(image, file.type);
        } catch (error) {
            console.error('Image upload error:', error);
        }
    };



    return (
        <div className="flex justify-center items-center w-full">
        <label htmlFor="file-upload" className="flex text-primary flex-col justify-center items-center w-32 h-32 border-2 border-tertiary border-opacity-30 rounded-full cursor-pointer hover:bg-aliceBlue">
            {loading ? (
                <CircularProgress />
            ) : uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
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
