import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { setCustomers } from "../../store/adminSlice";

const CustomerListPage = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("");
  const { customers } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get("/user/all");
        dispatch(setCustomers(res.data.data));
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [dispatch]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle actions (ban, unban, make admin)
  const handleBan = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === id ? { ...customer, banned: true } : customer
      )
    );
  };

  const handleUnban = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === id ? { ...customer, banned: false } : customer
      )
    );
  };

  const handleMakeAdmin = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === id ? { ...customer, role: "admin" } : customer
      )
    );
  };

  const handleMakeUser = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === id ? { ...customer, role: "user" } : customer
      )
    );
  };

  return (
    <div className="bg-white text-xs overflow-y-scroll custom-scrollbar dark:bg-gray-900 text-gray-900 dark:text-gray-100 m-2 p-4 rounded-lg shadow-lg min-h-screen mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Customer List</h1>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search customers..."
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg w-full shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute right-3 top-3" />
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
          >
            <div className="flex items-center mb-2">
              <img
                src={customer.avatar || "default-avatar.png"} // Add a default avatar image
                alt="Avatar"
                className="h-12 w-12 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold text-sm">{customer.fullName}</h3>
                <p className="text-xs">{customer.email}</p>
                <p className="text-xs">Role: {customer.role}</p>
              </div>
            </div>
            <div className="flex justify-between mt-auto space-x-2">
              {customer.isBanned ? (
                <button
                  onClick={() => handleUnban(customer._id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded-lg"
                >
                  <CheckIcon className="h-4 w-4 inline-block mr-1" />
                  Unban
                </button>
              ) : (
                <button
                  onClick={() => handleBan(customer._id)}
                  className="flex-1 bg-red-500 text-xs hover:bg-red-600 text-white py-1 rounded-lg"
                >
                  <NoSymbolIcon className="h-4 w-4 inline-block mr-1" />
                  Ban
                </button>
              )}
              {customer.role === "customer" && (
                <button
                  onClick={() => handleMakeAdmin(customer._id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg"
                >
                  Make Admin
                </button>
              )}
              {customer.role === "admin" && (
                <button
                  onClick={() => handleMakeUser(customer._id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg"
                >
                  Make User
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerListPage;
