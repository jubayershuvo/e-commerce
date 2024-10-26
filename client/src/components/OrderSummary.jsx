import React from "react";
import axios from 'axios'
import { FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { clearAll } from "../store/usersSlice";
import { useNavigate } from "react-router-dom";

function OrderSummary({ handleNext, handleBack, user }) {
  const navigate = useNavigate()
  const { currency, cartList, discountedCuponPrice } = useSelector(
    (state) => state?.Users
  );
  const dispatch = useDispatch();
  const orderItems = cartList;
  const userAddress = user.shippingAddress;
  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const filterProducts = cartList.map(product => {
    return { item: product._id, quantity: product.quantity };
  })
  const shipping = 100;
  const total = subtotal + shipping - Math.floor(Number(discountedCuponPrice));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data ={
      shippingCost: Number(shipping),
      couponDiscount: Math.floor(Number(discountedCuponPrice)),
      products: filterProducts

    }
    try {
      // Submit the data if validation passed
      const response = await axios.post("/order/add", data);
    
      if (response?.data?.data) {
        const data = response.data.data;
        navigate(`/payment/${data.order._id}`);
        dispatch(login(data.user));
      } else {
        // Handle unexpected response structure
        console.log("Error adding address. Please try again.");
      }
    } catch (error) {
      // Handle request errors
      console.error("Error submitting the form: ", error);
    } finally {
      // Clear all even after an error if this behavior is intended
      dispatch(clearAll());
    }
    handleNext();
  };
  return (
    <>
      <div className="p-6 mt-5 md:mt-10 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all border dark:border-gray-700">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center space-x-2">
            <FaUser className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
              {userAddress.firstName + " " + userAddress.lastName}
            </h2>
          </div>
          <hr className="mt-2 border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mr-3" />
            <div className="leading-relaxed">
              <div className="flex">
                <p>{userAddress.address2 + " " + userAddress.address1}</p>
              </div>
              <p>
                {userAddress.city}, {userAddress.state} {userAddress.zip}
              </p>
              <p>{userAddress.country}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt className="text-blue-600 dark:text-blue-400 mr-3" />
            <p className="font-semibold">
              {userAddress.countryCode + userAddress.mobileNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex justify-center items-center px-5 py-10">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
            Order Summary
          </h2>

          {/* Order Items */}
          <div className="mb-8">
            {orderItems.map((item, i) => (
              
              <div
                key={i}
                className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                      {item.title}
                    </h4>
                    <div className="flex">
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                      {`Qty: ${item.quantity}`}
                    </p>
                    {item.selectedSize && <p className="text-gray-600 px-2 dark:text-gray-400 text-xs md:text-sm">
                      {`Size: ${item.selectedSize}`}
                    </p>}
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                  {`${(item.price * item.quantity).toFixed(2)} ${currency}`}
                </p>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Subtotal */}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Subtotal
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                {`${subtotal.toFixed(2)} ${currency}`}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Shipping
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                {`+${shipping.toFixed(2)} ${currency}`}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Coupon
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                {`-${Math.floor(Number(discountedCuponPrice)).toFixed(2)} ${currency}`}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base">
                Total
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-sm md:text-base">
                {`${total.toFixed(2)} ${currency}`}
              </span>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleBack}
              type="button"
              className="py-3 px-6 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-500"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="py-3 px-6 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
