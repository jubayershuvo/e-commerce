import React, { useEffect, useState } from 'react';
import { ChartBarIcon, ShoppingCartIcon, ClockIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get('/admin/order/all');
        setAllOrders(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, []);
  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get('/admin/order/withoutp');
        setConfirmedOrders(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, []);
  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get('/product/all');
        setAllProducts(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, []);

  let orderTotalBDT = confirmedOrders.reduce((acc, order) => {
    return acc + order.total;
  }, 0);

  useEffect(() => {
    const pendingOrders = allOrders.filter((order) => order.status === 'pending');
    setPendingOrders(pendingOrders);
  }, [allOrders]);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Products Widget */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <div className="flex items-center">
              <ClockIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Pending Products</h3>
                <p className="text-xl font-bold">{pendingOrders.length}</p>
              </div>
            </div>
          </div>

          {/* Total Products Widget */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-10 w-10 text-green-500" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Total Products</h3>
                <p className="text-xl font-bold">{allProducts.length}</p>
              </div>
            </div>
          </div>

          {/* More Widget */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <div className="flex items-center">
              <ChartBarIcon className="h-10 w-10 text-yellow-500" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Sales</h3>
                <p className="text-xl font-bold">{orderTotalBDT} BDT</p>
              </div>
            </div>
          </div>

          {/* Another Widget Example */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
            <div className="flex items-center">
              <ChartBarIcon className="h-10 w-10 text-red-500" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold">Orders</h3>
                <p className="text-xl font-bold">{allOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-5">Recent Activities</h2>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg">
            <p>Here you can display recent activity or other important information for the admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
