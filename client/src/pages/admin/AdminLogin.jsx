import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../../store/adminSlice';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false);

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(login && password){
            try {
                const res = await axios.post('/admin/login',{
                    login,
                    password
                })
                dispatch(adminLogin(res.data.data))
                navigate('/admin')
            } catch (error) {
                toast.error(error.response.data.message)
                console.log(error)
            }
        }
    }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
        <Toaster position='top-center'/>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Toggle for Dark Mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-600 dark:text-gray-400"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            Admin Login
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={login}
                onChange={(e)=> setLogin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Enter your email or username"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            Forgot your password?{' '}
            <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">
              Click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
