import React, { useEffect, useState } from 'react';
import axios from 'axios'

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get(`/payment/all`);
        setPayments(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Payment List</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((payment) => (
            <div
              key={payment.paymentID}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedPayment(payment)}
            >
              <p className="text-sm md:text-base font-semibold break-words">
                Amount: {payment.amount} {payment.currency}
              </p>
              <p className="text-sm md:text-base break-words">Status: {payment.status}</p>
              <p className="text-sm md:text-base break-words">Date: {payment.date}</p>
            </div>
          ))}
        </div>

        {/* Payment Details */}
        {selectedPayment && (
          <PaymentDetails payment={selectedPayment} close={() => setSelectedPayment(null)} />
        )}
      </div>
    </div>
  );
};

const PaymentDetails = ({ payment, close }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <h2 className="text-xl font-bold">Payment Details</h2>
        <p className="mt-2 text-sm md:text-base break-words">Payment ID: {payment.paymentID}</p>
        <p className="mt-2 text-sm md:text-base break-words">Amount: {payment.amount} {payment.currency}</p>
        <p className="mt-2 text-sm md:text-base break-words">Status: {payment.status}</p>
        <p className="mt-2 text-sm md:text-base break-words">Transaction ID: {payment.trxID}</p>
        <p className="mt-2 text-sm md:text-base break-words">Verification SING: {payment.verificationSING}</p>
        <p className="mt-2 text-sm md:text-base break-words">Payment Method: {payment.paymentMethod}</p>
        <p className="mt-2 text-sm md:text-base break-words">Risk Level: {payment.risk_level || 'N/A'}</p>
        <p className="mt-2 text-sm md:text-base break-words">Stored Amount: {payment.stored_amount || 'N/A'}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
