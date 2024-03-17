"use client";
import React, { useState } from 'react';
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
      const response = await axios.post('http://localhost:8080/api/2FA/verifyCode', { code: otp });
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

  return (
    <div className="max-sm:min-w-full md:w-3/4 lg:w-1/2 mx-auto max-w-md">
      <ToastContainer />
      <div className="justify-center items-center flex flex-col min-h-screen">
        
        <form onSubmit={handleOTPVerification} className="bg-basicallylight drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
        <Link href="/">
          
            <ArrowBackIcon className="text-primary cursor-pointer absolute left-4 top-4" />
          
        </Link>
        <h1 className="text-2xl text-primary font-bold mb-4">Enter OTP to Verify</h1>
          <InputField
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
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

