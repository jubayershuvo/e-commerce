import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function VerifyForgetPassword() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const inputRef = useRef(null);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      inputRef.current.focus();
    }
  }, [isLoggedIn, navigate]);

  const [code, setCode] = useState("");

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      toast.error("Enter OTP...!");
    } else if (code.length !== 6) {
      toast.error("Enter 6 digit OTP...!");
    } else {
      const codeloading = toast.loading("Verifying OTP..!");
      try {
        // Send POST request to API endpoint
        await axios.post(
          "http://localhost:8080/api/v1/users/verify-code",
          { code },
          {
            withCredentials: true,
          }
        );

        toast.success("OTP Verified successfully!", { id: codeloading });
        navigate("/set-password");
      } catch (error) {
        toast.error(error?.response?.data?.message, { id: codeloading });
      }
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify forget OTP.
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ml-2"
                  >
                    OTP
                  </label>
                  <input
                    ref={inputRef}
                    type="number"
                    name="code"
                    value={code}
                    onChange={handleChange}
                    id="code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter 6 digit OTP...!"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Verify
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerifyForgetPassword;
