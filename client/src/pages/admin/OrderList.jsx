import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "ontheway", label: "On The Way" },
  { value: "delivered", label: "Delivered" },
  { value: "returned", label: "Returned" },
  { value: "canceled", label: "Canceled" },
];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState(""); // State for search query
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(""); // State for status filter

  const handleEdit = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Order updating...");
    try {
      const res = await axios.post("/admin/order/update/status", {
        orderId: order._id,
        status,
        message,
      });
      setOrders(res.data.data);
      toast.success("Status updated..", { id: loading });
    } catch (error) {
      toast.error(error.response.data.message, { id: loading });
    }
    setMessage("");
    setEdit(false);
  };

  useEffect(() => {
    async function fetch() {
      const res = await axios.get("/admin/order/all");
      if (res.data) {
        setOrders(res.data.data);
      }
    }
    fetch();
  }, []);

  // Filter orders based on search query and selected status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id.includes(searchId);
    const matchesStatus =
      selectedStatusFilter === "" || order.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-96 max-w-full sm:text-sm">
            {/* Popup Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Change Order Status
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => {
                  setEdit(false);
                  setMessage("");
                }}
              >
                <XMarkIcon width={25} />
              </button>
            </div>

            {/* Status Dropdown */}
            <div className="mt-4">
              <label
                htmlFor="status"
                className="block text-gray-700 dark:text-gray-200 mb-1"
              >
                Order Status
              </label>
              <select
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                value={status}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:text-gray-300"
              >
                {statusOptions &&
                  statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Message Box */}
            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-gray-700 dark:text-gray-200 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-gray-800 dark:text-gray-300 resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="mt-6 w-full space-x-4 text-center">
              <button
                onClick={handleEdit}
                className="px-4 py-2 w-1/2 bg-green-500 text-white rounded-md hover:bg-green-600 text-base focus:outline-none dark:bg-green-700 dark:hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`bg-white min-h-screen overflow-y-scroll custom-scrollbar ${
          edit && "opacity-50"
        } dark:bg-gray-900 p-4 shadow-md mx-auto`}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          All Orders
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />

        {/* Status Filter Dropdown */}
        <select
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          value={selectedStatusFilter}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="flex relative z-40 flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4"
            >
              {/* Order Header */}
              <div className="flex overflow-y-scroll custom-scrollbar justify-between items-center mb-2">
                <div className="text-sm text-gray-900 dark:text-white">
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    order.status === "confirmed"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200"
                      : order.status === "canceled"
                      ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                      : order.status === "returned"
                      ? "bg-green-100 text-orange-600 dark:bg-orange-800 dark:text-orange-200"
                      : "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                  }`}
                >
                  {order.status === "ontheway"
                    ? "On The Way"
                    : capitalizeFirstLetter(order.status)}
                </span>
              </div>

              {/* Products List */}
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Products:
                </p>
                <ul className="list-disc pl-4 text-sm text-gray-700 dark:text-gray-400">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.item?.title} -
                      {Number(product.item?.price).toFixed(2)} BDT
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Address */}
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Shipping Address:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {order.shippingAddress.address1}
                </p>
              </div>

              {/* Costs */}
              <div className="text-sm text-gray-900 dark:text-white">
                <p>
                  <span className="font-semibold">Shipping Cost:</span>
                  {order.shippingCost.toFixed(2)} BDT
                </p>
                {order.discount > 0 && (
                  <p>
                    <span className="font-semibold">Discount:</span>
                    {order.discount.toFixed(2)} BDT
                  </p>
                )}
                {order.couponDiscount > 0 && (
                  <p>
                    <span className="font-semibold">Coupon Discount:</span> $
                    {order.couponDiscount.toFixed(2)}
                  </p>
                )}
                <p className="font-semibold">
                  Total: {order.total.toFixed(2)} BDT
                </p>
              </div>
              <div className="absolute right-4 bottom-4">
                <button
                  onClick={() => {
                    setEdit(true);
                    setOrder(order);
                    setStatus(order.status);
                  }}
                  className="px-2"
                >
                  <PencilSquareIcon
                    width={20}
                    className="text-black dark:text-white"
                  />
                </button>
                <button
                  onClick={() => navigate(`/admin/order/${order._id}`)}
                  className="px-2"
                >
                  <EyeIcon width={20} className="text-black dark:text-white" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-900 dark:text-white text-center">
            No orders found
          </p>
        )}
      </div>
    </>
  );
};

export default OrderList;
