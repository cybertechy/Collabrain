import React from 'react';
import Lottie from "lottie-react";
import LoadingStates from './loadingStates';

const LoaderComponent = ({ isLoading, loadingState }) => {
  if (!isLoading) return null;

  // Directly use the animation from LoadingStates based on the provided state
  const { message, animation } = LoadingStates[loadingState] || LoadingStates.DEFAULT;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex flex-col items-center justify-center">
      <Lottie animationData={animation} play="true" loop={true} 
              style={{ width: 200, height: 200 }} />
      <h1 className="text-xl font-bold mb-5 text-primary">{message}</h1>
    </div>
  );
};

export default LoaderComponent;
