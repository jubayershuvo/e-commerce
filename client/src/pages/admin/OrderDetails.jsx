import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const { _id } = useParams();
  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get(`/admin/order/single/${_id}`);
        if (res.data) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [_id]);
  console.log(order);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 shadow-md mx-auto">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Order Details
      </h2>

      {/* Order Info */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-semibold">Order ID:</span> {_id}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Date: {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm text-gray-900 dark:text-white">
          <span className="font-semibold">Status:</span> {order.status}
        </p>
        {order.message && (
          <p className="text-sm text-yellow-500 dark:text-yellow-300">
            <span className="font-semibold">Message:</span> {order.message}
          </p>
        )}
      </div>

      {/* User Info */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          User Information
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          <span className="font-semibold">ID:</span> {order.user?._id}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          <span className="font-semibold">Full Name:</span>{" "}
          {order.user?.fullName}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          <span className="font-semibold">Email:</span> {order.user?.email}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Shipping Address
        </h3>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          {order.shippingAddress?.address1}, {order.shippingAddress?.address2}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
          {order.shippingAddress?.zip}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-400">
          {order.shippingAddress?.country}, Mobile:{" "}
          {order.shippingAddress?.countryCode}{" "}
          {order.shippingAddress?.mobileNumber}
        </p>
      </div>

      {/* Product List */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Products
        </h3>
        <ul className="list-disc pl-4 text-sm text-gray-700 dark:text-gray-400">
          {order.products?.map((product, index) => (
            <li key={index} className="mb-2">
              <div className="flex items-start">
                <img
                  src={product.item.imageUrl}
                  alt={product.item.imageAlt}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex w-full justify-between">
                  <div className="">
                    <p className="text-sm font-semibold">
                      {product.item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Size: {product.item.selectedSize}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-sm font-bold">
                      {product.item.price} BDT
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Cost Breakdown
        </h3>
        <div className="text-sm w-full text-gray-900 dark:text-white">
          <p className="flex justify-between text-green-500">
            <span className="font-semibold">Order Price:</span>
            <span>{order.orderPrice} BDT</span>
          </p>
          <p className="flex justify-between text-green-500">
            <span className="font-semibold">Shipping Cost:</span>
            {order.shippingCost} BDT
          </p>
          {order.discount > 0 && (
            <p className="flex justify-between text-red-500">
              <span className="font-semibold">Discount:</span>
              <span>-{order.discount} BDT</span>
            </p>
          )}

          {order.couponDiscount > 0 && (
            <p className="flex justify-between text-red-500">
              <span className="font-semibold">Coupon Discount:</span>-
              {order.couponDiscount} BDT
            </p>
          )}
          <hr className="opacity-55 my-1" />
          <p className="font-semibold w-full flex justify-between text-blue-500">
            <span className="font-extrabold">Total: </span>
            <span>{order.total} BDT</span>
          </p>
        </div>
        {order.status === "pending" || order.status === "cancel" ? (
          <></>
        ) : (
          <>
            {order.payment && (
              <div className="w-full text-end mt-2">
                <button
                  onClick={() => navigate(`/admin/payment/${order.payment}`)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
                >
                  Payment Details
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
