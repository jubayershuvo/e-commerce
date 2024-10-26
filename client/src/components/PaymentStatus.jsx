import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatus = ({ status, orderId }) => {
  const navigate = useNavigate()
  let message, backgroundColor, textColor;

  switch (status) {
    case "success":
      message = "Payment Successful! Thank you for your purchase.";
      backgroundColor = "bg-green-100 dark:bg-green-800";
      textColor = "text-green-700 dark:text-green-300";
      break;
    case "failure":
      message = "Payment Failed! Please try again.";
      backgroundColor = "bg-red-100 dark:bg-red-800";
      textColor = "text-red-700 dark:text-red-300";
      break;
    case "cancel":
      message = "Payment Canceled! You can retry the transaction.";
      backgroundColor = "bg-yellow-100 dark:bg-yellow-800";
      textColor = "text-yellow-700 dark:text-yellow-300";
      break;
    default:
      message = "Unknown status.";
      backgroundColor = "bg-gray-100 dark:bg-gray-800";
      textColor = "text-gray-700 dark:text-gray-300";
  }

  return (
    <div
      className={`flex items-center justify-center h-screen p-4 dark:bg-gray-900`}
    >
       <div className={`max-w-md w-full rounded-lg shadow-md p-6 ${backgroundColor} ${textColor}`}>
        <h2 className={`text-lg font-semibold ${textColor}`}>{status.charAt(0).toUpperCase() + status.slice(1)}!</h2>
        <p className={`mt-2 text-sm ${textColor}`}>{message}</p>
        
        {/* Action Buttons */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => navigate(`/order/${orderId}`)} // Navigate to Order Details
            className={`bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition`}
          >
            See Order Details
          </button>
          <button
            onClick={() => navigate('/')} // Navigate to Home
            className={`bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition`}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
