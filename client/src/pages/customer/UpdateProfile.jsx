import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";

function UpdateProfile() {
  const { isLoggedIn, user } = useSelector((state) => state?.auth);
  const loggedUser = user;
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState();
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleCheckboxChange = (e) => {
    setPasswordType(e.target.checked ? "text" : "password");
  };

  useEffect(() => {
    if (loggedUser) {
      setName(loggedUser.fullName);
      setEmail(loggedUser.email);
    }
  }, [loggedUser]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Handle Avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const changeAvatar = async () => {
    if (avatarFile) {
      const loadingToast = toast.loading("Updating avatar photo...");
      try {
        // Send POST request to API endpoint
        const res = await axios.patch(
          "/user/update-avatar",
          { avatar: avatarFile },
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important to send FormData
            },
          }
        );
        dispatch(login(res?.data?.data));
        toast.success("Avatar updated...!", { id: loadingToast });
      } catch (error) {
        toast.error("Avatar update faild...!", { id: loadingToast });
      }
    }
  };
  const changePassword = async () => {
    if (oldpassword || password || cpassword) {
      if (password !== cpassword) {
        toast.error("Confirm password doesn't matched..!");
        return;
      }
      if (password === oldpassword) {
        toast.error("Old password and new password almost same..!");
        return;
      }
      const loadingToast = toast.loading("Password updating...");
      try {
        // Send POST request to API endpoint
        const res = await axios.post("/user/update-password", {
          oldPassword: oldpassword,
          newPassword: password,
        });
        dispatch(login(res?.data?.data));
        toast.success("Password updated...!", { id: loadingToast });
      } catch (error) {
        toast.error(error.response.data.message, { id: loadingToast });
      }
    }
  };
  const changeEmail = async () => {
    if (email) {
      const loadingToast = toast.loading("Updating email...");
      try {
        await axios.post("/user/update-email", { email });
        navigate("/email/verify");
        toast.success("OTP delivered...!", { id: loadingToast });
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, { id: loadingToast });
      }
    }
  };
  const changeName = async () => {
    if (name) {
      const loadingToast = toast.loading("Updating Full Name...");
      try {
        // Send POST request to API endpoint
        const res = await axios.patch("/user/update-user", { fullName: name });
        dispatch(login(res?.data?.data));
        toast.success("Full name updated...!", { id: loadingToast });
      } catch (error) {
        toast.error("Name update faild...!", { id: loadingToast });
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 flex flex-col items-center">
      <div className="bg-white md:w-1/2 mt-12 dark:bg-gray-800 dark:text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Avatar and Profile Info Section */}
        <div className="w-full max-w-4xl mx-auto -mt-16 flex flex-col items-center relative">
          {/* Avatar */}
          <div className="relative mx-auto">
            <img
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              src={avatar || loggedUser?.avatar || "./user.svg"}
              alt="Avatar"
            />
            {/* Upload Avatar Button */}
            <label className="absolute bottom-0 right-0 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 py-2 px-3 rounded-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <span className="text-sm">Select</span>
            </label>
          </div>
        </div>
        <div className="flex items-center mt-5 justify-between w-full mb-4 mx-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white m-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={changeAvatar}
          >
            Change avatar
          </button>
        </div>
        <div className="w-full max-w-md mx-auto">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={loggedUser?.fullName}
            />
          </div>
          <div className="flex items-center justify-between w-full mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white m-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={changeName}
            >
              Change name
            </button>
          </div>

          <div className="mb-4 ">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={loggedUser?.email}
            />
          </div>

          <div className="flex items-center justify-between w-full mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white m-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={changeEmail}
            >
              Change email
            </button>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 mt-2 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="oldpassword"
            >
              Old Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
              id="oldpassword"
              type={passwordType}
              name="password"
              value={oldpassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={"Old password"}
            />
            <label
              className="block text-gray-700 mt-2 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="newpassword"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
              id="newpassword"
              type={passwordType}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"New password"}
            />
            <label
              className="block text-gray-700 mt-2 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="cpassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
              id="cpassword"
              type={passwordType}
              name="password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              placeholder={"Confirm password"}
            />
            <div className="flex mt-2 items-center gap-2 p-2 border-none rounded-lg">
              <input
                className="cursor-pointer dark:bg-gray-600 focus:outline-none order-none"
                type="checkbox"
                id="checkbox"
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor="checkbox"
                className="text-gray-700 font-medium cursor-pointer"
              >
                Show password
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white m-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={changePassword}
            >
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
