import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";

const MiniProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Avatar */}
      <button onClick={toggleDropdown} className="focus:outline-none">
        <img
          src={user.avatar}
          alt="Avatar"
          className="md:w-8 md:h-8 w-6 h-6 rounded-full object-cover object-center"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={"/profile"}
            className="block w-full text-left px-4 pb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            My Profile
          </Link>
          <hr className="opacity-55" />
          <Link
            to={"/myorders"}
            className="block w-full text-left px-4 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            My Orders
          </Link>
          <hr className="opacity-55" />
          <button className="block w-full text-left px-4 pt-2 ">
            <LogoutBtn />
          </button>
        </div>
      )}
    </div>
  );
};

export default MiniProfile;
