import React from "react";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold">Loading Fantasy Manager...</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
