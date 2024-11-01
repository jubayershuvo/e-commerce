import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";
import { setCustomers } from "../../store/adminSlice";

const CustomerListPage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [editCustomer, setEditCustomer] = useState({});
  const { customers } = useSelector((state) => state.adminAuth);
  const [password, setPassword] = useState('');
  const [editType, setEditType] = useState('');

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
  const handleBan = async(id) => {
    const loading = toast.loading("User banning...")
    try {
      const res = await axios.get(`/admin/user/ban/${id}`)
      dispatch(setCustomers(res.data.data));
      toast.success("User banned", {id:loading})
    } catch (error) {
      toast.error(error.response.data.messase,{id:loading})
      console.log(error)
    }
  };

  const handleUnban = async(id) => {
    const loading = toast.loading("User unBanning...")
    try {
      const res = await axios.get(`/admin/user/unban/${id}`)
      dispatch(setCustomers(res.data.data));
      toast.success("User Unbanned", {id:loading})
    } catch (error) {
      toast.error(error.response.data.messase,{id:loading})
      console.log(error)
    }
  };

  const handleRole = async()=>{
    if(password){
      if(editType === "customer"){
        console.log('maked admin')
      }else if(editType === "admin"){

      }
      return
    }
    return
  }

  return (
    <>
      {editCustomer._id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={()=> setEditCustomer({})}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 dark:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRole()
                  setEditCustomer({});
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
                <p className="text-xs">Id: {customer._id}</p>
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
                <>
                  {customer.role === "customer" && (
                    <button
                      onClick={() => handleBan(customer._id)}
                      className="flex-1 bg-red-500 text-xs hover:bg-red-600 text-white py-1 rounded-lg"
                    >
                      <NoSymbolIcon className="h-4 w-4 inline-block mr-1" />
                      Ban
                    </button>
                  )}
                </>
              )}
              {customer.role === "customer" && (
                <button
                onClick={() => {
                  setEditCustomer(customer)
                  setEditType("admin")
                }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-lg"
                >
                  Make Admin
                </button>
              )}
              {customer.role === "admin" && (
                <button
                  onClick={() => {
                    setEditCustomer(customer)
                    setEditType("customer")
                  }}
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
    </>
  );
};

export default CustomerListPage;
