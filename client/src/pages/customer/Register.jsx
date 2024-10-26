import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    cpassword: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const checkboxHandler = (e) => {
    setIsChecked(e.target.checked);
  };

  const [passwordType, setPasswordType] = useState("password");
  useEffect(() => {
    if (isChecked) {
      setPasswordType("text");
    } else if (!isChecked) {
      setPasswordType("password");
    }
  }, [isChecked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    if (!data.fullName) {
      toast.error("Name is required..!");
    } else if (!data.username) {
      toast.error("Username is required");
    } else if (!data.email) {
      toast.error("Email is required");
    } else if (!data.password) {
      toast.error("Password is required");
    } else if (data.password !== data.cpassword) {
      toast.error("Confirm password doesn't match..!");
    } else {
      const registerLoading = toast.loading("Checking data...!");
      try {
        // Send POST request to API endpoint
        await axios.post(
          "/user/register",
          {
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password,
          },
          {
            headers: {
              "Content-Type": "application/json", // Important to send FormData
            },
          }
        );
        toast.success("OTP delivered successfully!", { id: registerLoading });
        navigate("/activate");
      } catch (error) {
        // Handle errors
        toast.error(error?.response?.data?.message, { id: registerLoading });
      }
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Registration form
            </h2>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="fullName"
                type="text"
                name="fullName"
                value={data.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={passwordType}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="******************"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="cpassword"
              >
                Confrim Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="cpassword"
                type={passwordType}
                name="cpassword"
                value={data.cpassword}
                onChange={handleChange}
                placeholder="******************"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    checked={isChecked}
                    value={isChecked}
                    onChange={checkboxHandler}
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Show password
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full mb-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white m-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Already have an account ?{" "}
              <Link
                to={"/login"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
