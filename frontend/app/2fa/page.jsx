// OTPVerificationPage.js
"use client";
import React, { useState } from 'react';
const { useRouter } = require("next/navigation");
import { ToastContainer, toast } from 'react-toastify';
import Button from "../../components/ui/button/button";
import InputField from '../../components/ui/input/input';
import axios from 'axios';
const fb = require("_firebase/firebase");

const handleSendOTP = async () => {
    try {
        const token = await fb.getToken();
      const response = await axios.post('http://localhost:8080/api/2FA/sendCode', null, {
        headers: { Authorization: `Bearer ${token}` }, // Include authorization token if required
      });
      // Handle the response as needed
      console.log(response.data.message); // Assuming your backend sends a message
      // Optionally, you can show a success message to the user
    } catch (error) {
      // Handle errors, such as network errors or API response errors
      console.error('Error sending OTP:', error.message);
      // Optionally, show an error message to the user
    }
  };
   

 
const OTPVerificationPage = () => {
  const router = useRouter();
  const [otp, setOTP] = useState('');
 
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/2FA/verifyCode', { code: otp });
      if (response.status === 200) {
        toast.success('OTP verified successfully');
        // Redirect to dashboard or other page on successful OTP verification
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
<div className="max-w-md mx-auto mt-10">
<ToastContainer />

<button onClick={handleSendOTP} className="text-center inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-basicallylight px-7 py-3 ">Send OTP</button> 
<h1 className="text-2xl font-bold mb-4">Enter OTP to Verify</h1>
<form onSubmit={handleOTPVerification}>
<InputField
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />
<Button type="submit" text="Verify OTP" color="primary" className="mt-4" />
</form>
</div>
  );
};
 
export default OTPVerificationPage;
