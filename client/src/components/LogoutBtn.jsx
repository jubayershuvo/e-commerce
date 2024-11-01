import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";

function LogoutBtn() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully..!");
  };
  return (
    <div
      onClick={handleLogout}
      className="px-4 py-1 mx-auto bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
    >
      Logout
    </div>
  );
}

export default LogoutBtn;
