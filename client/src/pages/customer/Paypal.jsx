import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const PayPalCheckoutButton = ({ amount, orderId }) => {
  const navigate = useNavigate()
  const handleSuccess = (details) => {
    axios.post(`/paypal/payment-success/${orderId}`, { details })
      .then(response => {
        toast.success(response.data.message)
        navigate(`/order/${response.data.data}`)
      })
      .catch(err => console.error("Server error", err));
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AQQQFMg4M_f7bTQOVOEcnPuaXjWY5xhf1gEUpi7IRltZrVYzLJSRbLi2al9WTcMqRUjh8oBGIH61H-Z8",
      }}
    >
      <PayPalButtons
      className="text-center w-full m-auto"
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {           
            handleSuccess(details)
          });
        }}
        onError={(err) => {
          console.log(err)
          toast.error("Payment faild...!")
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;
