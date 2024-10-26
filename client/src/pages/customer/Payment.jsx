import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import WaitingForRedirect from "../../components/Waiting";
import PayPalCheckoutButton from "./Paypal";

function PaymentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { _id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const query = searchParams.get("paymentMethod");
  const [order, setOrder] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()), // Keep current params
      paymentMethod: paymentMethod, // Update a specific param1
    });
  };

  useEffect(() => {
    // Fetch product data based on the 'id' parameter
    const fetchProduct = async () => {
      try {
        const response = await axios(`/order/myorder/${_id}`);
        setOrder(response.data.data);
        if (response.data.data.status !== "pending") {
          navigate("/myorders");
        }
      } catch (error) {
        navigate("/myorders");
      }
    };
    fetchProduct();
  }, [_id, navigate]);
  useEffect(() => {
    if (query !== null) {
      if (query === "bkash") {
        async function fetch() {
          try {
            const res = await axios.post("/bkash/payment/create", {
              amount: order.total,
              orderId: order._id,
            });
            window.location.href = res.data.data;
          } catch (error) {
            console.log(error);
          }
        }
        fetch();
      } else if (query === "sslcommerz") {
        async function fetch() {
          try {
            const res = await axios.get(`/sslcommerz/init/${order._id}`);
            window.location.href = res.data.data;
          } catch (error) {
            console.log(error);
          }
        }
        fetch();
      } else if (query === "cashOnDelivery") {
        async function fetch() {
          try {
            const res = await axios.get(`/cod/add/${order._id}`);
            console.log(res);
            window.location.href = res.data.data;
          } catch (error) {
            console.log(error);
          }
        }
        fetch();
      }
    }
    return;
  }, [query, order]);
  return (
    <>
      {query === null && (
        <div
          className={`min-h-screen flex items-center justify-center py-8 dark:bg-gray-800`}
        >
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow-md rounded-md">
            {/* Payment Form */}
            <h1 className="text-xl text-center font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Payment Options for {order.user?.fullName}
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Payment Methods */}
              <div className="space-y-4">
                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={paymentMethod === "cashOnDelivery"}
                    onChange={() => setPaymentMethod("cashOnDelivery")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Cash on Delivery
                  </span>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Bkash
                  </span>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === "sslcommerz"}
                    onChange={() => setPaymentMethod("sslcommerz")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    SSL Commerz
                  </span>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    PayPal
                  </span>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Credit/Debit Card
                  </span>
                </label>

                <label className="block">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="other"
                    checked={paymentMethod === "other"}
                    onChange={() => setPaymentMethod("other")}
                    className="mr-2 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Other Options
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {query === "paypal" && (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="text-base scale-150 text-center justify-center">
            {order?.total && (
              <PayPalCheckoutButton
                amount={(Number(order?.total) / 120).toFixed(2)}
                orderId={_id}
              />
            )}
          </div>
        </div>
      )}

      {query && query !== "paypal" && <WaitingForRedirect />}
    </>
  );
}

export default PaymentPage;
