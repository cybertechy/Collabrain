"use client";
import React, { useState, useEffect } from 'react';
const { useRouter } = require("next/navigation");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const token = await fb.getToken();
      const response = await axios.post('http://localhost:8080/api/2FA/sendCode', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.message);
      toast.success('OTP sent successfully',{
        theme: "colored",
        position: "top-center"
      });
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      toast.error('Error sending OTP',{
        theme: "colored",
        position: "top-center"
      });
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const token = await fb.getToken();
      const response = await axios.post('http://localhost:8080/api/2FA/verifyCode', { code: otp } ,  {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success('OTP verified successfully',{
          theme: "colored",
          position: "top-center"
        });
        router.push('/dashboard');
      } else {
        toast.error('Failed to verify OTP',{
          theme: "colored",
          position: "top-center"
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP',{
        theme: "colored",
        position: "top-center"
      
      });
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
    return () => {
      document.body.classList.remove('custom-background');
    };
  }, []);

  if (!backgroundLoaded) {
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
        <form onSubmit={handleOTPVerification} className="bg-basicallylight drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
          <Link href="/">

            <ArrowBackIcon className="text-primary cursor-pointer absolute left-4 top-4" />

          </Link>
          <h1 className="text-2xl text-primary font-bold mb-4">Enter OTP to Verify</h1>
          <InputField
            type="text"
            placeholder="Enter OTP"
            value={otp}
            input={otp}
            setInput={setOTP}
            className="mt-4"
          />
          <Button type="submit" text="Verify OTP" color="primary" className="mt-4" />
          <p>Click here to receive OTP</p>
          <button onClick={handleSendOTP} className="underline underline-offset-1 text-primary">Send OTP</button>

        </form>
      </div>
    </div>
  );
};

export default OTPVerificationPage;

