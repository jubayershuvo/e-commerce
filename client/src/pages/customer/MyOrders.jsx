import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSelector } from "react-redux";

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);


  useEffect(() => {
    async function fetch() {
      try {
        // Submit the data if validation passed
        const response = await axios.get("/order/myorders");
  
        if (response?.data?.data) {
          setOrders(response.data.data)
           // Proceed to the next step after success
        } else {
          console.log("Error adding address. Please try again.");
        }
      } catch (error) {
        console.log("Error during address submission: ", error);
      }
    }
    fetch()
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Order History
      </h2>

      {orders.length > 0 ? (
        orders?.map((order) => {
          const orderDate = new Date(order?.date);
          const year = orderDate.getUTCFullYear();
          const month = String(orderDate.getUTCMonth() + 1).padStart(2, "0");
          const day = String(orderDate.getUTCDate()).padStart(2, "0");
        
          return (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"
            >
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
                      {`${year}-${month}-${day}`}
                    </span>
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Total:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.total}
                    </span>
                  </p>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
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
                </div>
              </div>
        
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                  Items
                </h3>
                <ul className="mt-2 space-y-2">
                  {order.products?.map((product, index) => (
                    <li
                      key={index}
                      className="flex justify-between text-sm md:text-base text-gray-700 dark:text-gray-300"
                    >
                      <span>{product.item.title}</span>
                      <span>
                        {product.quantity} x {product.item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
        
              <div className="mt-4">
                <Link
                  to={`/order/${order._id}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm md:text-base"
                >
                  View Order Details →
                </Link>
              </div>
            </div>
          );
        })
        
      ) : (
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p>No orders found.</p>
          <Link
            to="/products"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm md:text-base"
          >
            Start Shopping →
          </Link>
        </div>
      )}
    </div>
  );
}
