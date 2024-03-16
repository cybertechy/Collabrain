"use client";
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify'
import EmailInputField from "../../components/ui/input/emailinput2";
import Button from "../../components/ui/button/button";
import fb from "_firebase/firebase";


const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    const errorMessage = await fb.sendPasswordReset(email);
    if (errorMessage) {
      setError(errorMessage);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Password reset email sent. Please check your inbox.');
      setError(null);
    }
  };

  return (
    <div className="max-sm:min-h-screen flex items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl text-primary font-sans mb-6 text-center">
          Forgot Your Password?
        </h1>
        <div className="bg-basicallylight drop-shadow-lg sm:p-10 rounded-2xl sm:mt-4 items-center justify-center">
          <div className="flex w-full max-sm:pr-4 items-center justify-center">
            <EmailInputField
              name="email"
              value={email}
              email={email}
              setEmail={setEmail}
              placeholder="Enter your email"
              color="primary"
            />
          </div>
          <div className="flex justify-center">
            <Button
              text="Reset Password"
              color="primary"
              onClick={handleResetPassword}
              className="mt-4 mr-2"
            />
          </div>
          <div className="flex justify-center">
            <a href="/" className="underline">
              Back to login
            </a>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
