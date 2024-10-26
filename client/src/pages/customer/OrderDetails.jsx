import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetails() {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({});
  useEffect(() => {
    // Fetch product data based on the 'id' parameter
    const fetchProduct = async () => {
      try {
        const response = await axios(`/order/myorder/${_id}`);
        setOrder(response.data.data);
      } catch (error) {
        navigate("/myorders");
      }
    };
    fetchProduct();
  }, [_id, navigate]);
  const orderDate = new Date(order?.date);
  const year = orderDate.getUTCFullYear();
  const month = String(orderDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(orderDate.getUTCDate()).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Order Details
      </h2>

      {/* Order Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              Order ID:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {order._id}
              </span>
            </p>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              Date:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {`${day}-${month}-${year}`}
              </span>
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm md:text-base md:text-end text-gray-700 dark:text-gray-300">
              Status:{" "}
              <span
                className={`font-medium ${
                  order.status === "Delivered"
                    ? "text-green-500 dark:text-green-400"
                    : "text-yellow-500 dark:text-yellow-400"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="dark:text-gray-300 text-gray-700">{`Message: ${order.message}`}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Shipping Address
        </h3>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          {`${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`}
        </p>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          {order.shippingAddress?.address2
            ? `${order.shippingAddress?.address2} ${order.shippingAddress?.address1}`
            : `${order.shippingAddress?.address1}`}
        </p>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
          {order.shippingAddress?.zip}
        </p>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          {order.shippingAddress?.country}
        </p>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          {`Phone: ${order.shippingAddress?.countryCode}${order.shippingAddress?.mobileNumber}`}
        </p>
      </div>

      {/* Order Items Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Items in your Order
        </h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.products?.map((product, index) => (
            <li key={index} className="py-4 flex justify-between">
              <div>
                <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                  {product.item.title}
                </p>
                <div className="flex">
                  <p className="text-sm pr-2 md:text-base text-gray-700 dark:text-gray-300">
                    Quantity: {product.quantity}
                  </p>
                  {product.item.selectedSize && (
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      Size: {product.item.selectedSize}
                    </p>
                  )}
                </div>
              </div>
              <div className="">
                <p className="text-sm opacity-50 line-through md:text-base font-medium text-gray-900 dark:text-white">
                  {(
                    Number(product.item.regularPrice) * Number(product.quantity)
                  ).toFixed(2)} BDT
                </p>
                <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                  {(
                    Number(product.item.price) * Number(product.quantity)
                  ).toFixed(2)} BDT
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing Breakdown Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h3>
        <div className="text-sm md:text-base space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Product price:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Number(order.orderPrice).toFixed(2)} BDT
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              +{Number(order.shippingCost).toFixed(2)} BDT
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Discount:</span>
            <span className="font-medium text-red-500 dark:text-red-400">
              -{Number(order.discount).toFixed(2)} BDT
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-300">Cupon:</span>
            <span className="font-medium text-red-500 dark:text-red-400">
              -{Number(order.couponDiscount).toFixed(2)} BDT
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              Total:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {Number(order.total).toFixed(2)} BDT
            </span>
          </div>
        </div>
        {order.status === "pending" && (
          <div className="w-full flex justify-between items-center pt-3">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button
            onClick={()=> navigate(`/payment/${order._id}`)}
             className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
              Pay {Number(order.total).toFixed(0)} BDT
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          to="/products"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm md:text-base"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
