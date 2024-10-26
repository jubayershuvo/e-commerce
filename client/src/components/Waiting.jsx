import React from 'react';

const WaitingForRedirect = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <p className="text-gray-900 dark:text-gray-100 text-lg md:text-xl font-semibold">
          Please wait while we redirect you...
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mt-2">
          This may take a few seconds.
        </p>
      </div>
    </div>
  );
};

export default WaitingForRedirect;
