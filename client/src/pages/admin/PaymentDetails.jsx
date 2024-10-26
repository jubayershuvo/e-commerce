import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import axios from "axios";

const PaymentDetailsPage = () => {
  const { _id } = useParams(); // Get paymentID from the route params
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payment details by paymentID
    const fetchPaymentDetails = async () => {
      try {
        const res = await axios.get(`/payment/single/${_id}`);
        setPayment(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [_id]);

  console.log(payment?.currency);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Payment details not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-10">
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">Payment Details</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2">
            <p className="break-words">
              <strong>Payment ID:</strong> {payment.paymentID}
            </p>
            <p className="break-words">
              <strong>Order ID:</strong> {payment.order}
            </p>
            <p className="break-words">
              <strong>User ID:</strong> {payment.user}
            </p>
            <p className="break-words">
              <strong>Amount:</strong> {payment.amount} {payment?.currency}
            </p>
            <p className="break-words">
              <strong>Status:</strong> {payment.status}
            </p>
            <p className="break-words">
              <strong>Date:</strong> {payment.date}
            </p>
            <p className="break-words">
              <strong>Transaction ID (TrxID):</strong> {payment.trxID}
            </p>
            <p className="break-words">
              <strong>Verification SING:</strong> {payment.verificationSING}
            </p>
            <p className="break-words">
              <strong>Payment Method:</strong> {payment.paymentMethod}
            </p>
            <p className="break-words">
              <strong>Risk Level:</strong> {payment.risk_level || "N/A"}
            </p>
            <p className="break-words">
              <strong>Stored Amount:</strong> {payment.stored_amount || "N/A"}{" "}
              {payment?.currency}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Additional Data</h2>
          <p className="break-words">
            {payment.allData
              ? payment.allData
              : "No additional data available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
