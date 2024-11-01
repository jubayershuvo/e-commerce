import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  // Fetch coupons from the server when the component mounts
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('/admin/coupon/all');
        if (response.status === 200) {
          setCoupons(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleAddCoupon = async () => {
    if (code && discount) {
      try {
        const response = await axios.post('/admin/coupon/add', {
          code,
          discount: parseFloat(discount),
        });
        
        if (response.status === 200) {
          setCoupons([...coupons, response.data.data]);
          setCode('');
          setDiscount('');
        }
      } catch (error) {
        console.error("Error adding coupon:", error);
      }
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const response = await axios.get(`/admin/coupon/delete/${couponId}`);
      if (response.status === 200) {
        // Remove deleted coupon from the list
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Add Coupon Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Add New Coupon</h2>
        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddCoupon}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Coupon
          </button>
        </form>
      </div>

      {/* Coupon List Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Coupon List</h2>
        <div className="mt-4 space-y-2 text-xs md:text-sm">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div key={coupon._id} className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 py-2">
                <div>
                  <span className="text-gray-800 dark:text-gray-100">Code: {coupon.code}</span>
                  <span className="ml-4 text-gray-600 dark:text-gray-300">Discount: {coupon.discount}%</span>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs md:text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No coupons available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponManager;
