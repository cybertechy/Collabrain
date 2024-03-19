"use client";
import React, { useState, useEffect } from 'react';
const { useRouter } = require("next/navigation"); 
import { ToastContainer, toast } from 'react-toastify';
import Button from "../../components/ui/button/button";
import InputField from '../../components/ui/input/input';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
const fb = require("_firebase/firebase");

const OTPVerificationPage = () => {
  const router = useRouter();
  const [otp, setOTP] = useState('');

  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    console.log(e);
  };
  
  

  const handleSendOTP = async () => {
    try {
      const token = await fb.getToken();
      const response = await axios.post('http://localhost:8080/api/2FA/sendCode', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.message);
      toast.success('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      toast.error('Error sending OTP');
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const token = await fb.getToken();
      const response = await axios.post('http://localhost:8080/api/2FA/verifyCode', { code: input }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success('OTP verified successfully');
        router.push('/dashboard');
      } else {
        toast.error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP');
    }
  };
  

  useEffect(() => {
    // Preload the background image
    const img = new Image();
    img.src = '/assets/images/background.jpg'; // Adjust the path to your background image
    img.onload = () => {
        setBackgroundLoaded(true);
        document.body.classList.add('custom-background');
    };

    // Remove the custom background class when the component unmounts
    return () =>
    {
        document.body.classList.remove('custom-background');
    };
}, []);

if (!backgroundLoaded)
{
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="loader"></div>
        </div>
    );
}

  return (
    <div className="max-sm:min-w-full md:w-3/4 lg:w-1/2 mx-auto max-w-md">

      <ToastContainer />

      <div className="justify-center items-center flex flex-col min-h-screen">
      <img
                        className="w-40"
                        src="./assets/images/logo_whitebackground.png"
                        alt="Logo"
                    />
                    
        <div className="bg-basicallylight drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
        <Link href="/">
          
            <ArrowBackIcon className="text-primary cursor-pointer absolute left-4 top-4" />
          
        </Link>
        <h1 className="text-2xl text-primary font-bold mb-4">Enter OTP to Verify</h1>

          <div className="input-container">
            <input
              className="bg-gray-100 rounded-sm pl-4 pr-10 py-2 w-full focus:outline-none transition-all duration-300 ease-in-out border-l-4 border-primary"
              type="text"
              value={input}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleOTPVerification} text="Verify OTP" color="primary" className="mt-4" />

          <p>Click here to receive OTP</p>
          <button onClick={handleSendOTP} className="underline underline-offset-1 text-primary">Send OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
