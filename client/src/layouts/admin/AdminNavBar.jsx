import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingBagIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DarkMode from "../../components/DarkMode";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { adminLogout } from "../../store/adminSlice";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdminLoggedIn, admin } = useSelector((state) => state.adminAuth);
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    if (isAdminLoggedIn === true) {
      const checkLocalCookie = async () => {
        const cookies = document.cookie.split("; ");
        const cookieName = "adminVerify";
        const exists = cookies.some((cookie) =>
          cookie.startsWith(`${cookieName}=`)
        );
        if (exists) {
          return;
        } else {
          try {
            await axios.post("/admin/refresh-token", {
              adminRefreshToken: admin.adminRefreshToken,
            });
          } catch (error) {
            console.log(error);
            dispatch(adminLogout());
          }
        }
      };

      checkLocalCookie();
    }
    return;
  }, [isAdminLoggedIn, admin, dispatch]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <Toaster position="top-center" />
      {/* Fixed sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 h-screen fixed">
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Logo
          </span>
          <DarkMode />
        </div>
        <nav className="flex-grow px-4 py-6">
          <NavLink
            to="/admin"
            className="flex mb-3 items-center text-blue-600 "
          >
            <ChartBarIcon className="h-6 w-6 mr-2" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/customers"
            className="flex mb-3 items-center text-blue-600"
          >
            <UserIcon className="h-6 w-6 mr-2" />
            Customers
          </NavLink>
          <NavLink
            to="/admin/products"
            className="flex mb-3 items-center text-blue-600"
          >
            <ShoppingBagIcon className="h-6 w-6 mr-2" />
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className="flex mb-3 items-center text-blue-600"
          >
            <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
            Orders
          </NavLink>

          <NavLink
            to="/admin/payments"
            className="flex mb-3 items-center text-blue-600"
          >
            <CreditCardIcon className="h-6 w-6 mr-2" />
            Payments
          </NavLink>

          <NavLink
            to="/admin/product/add"
            className="flex mb-3 items-center text-blue-600"
          >
            <PlusIcon className="h-6 w-6 mr-2" />
            Add Product
          </NavLink>
        </nav>
      </div>

      {/* Mobile navbar */}
      <div className="md:hidden flex items-center w-full bg-white dark:bg-gray-900 px-4 py-3 border-b dark:border-gray-700 fixed z-10">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Logo
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-900 dark:text-white mx-2 focus:outline-none"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <DarkMode />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 flex">
          <div className="w-64 bg-white dark:bg-gray-900 h-screen shadow-lg">
            <nav className="px-4 py-6">
              <NavLink
                to="/admin"
                className="flex mb-3 items-center text-blue-600 "
              >
                <ChartBarIcon className="h-6 w-6 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/customers"
                className="flex mb-3 items-center text-blue-600"
              >
                <UserIcon className="h-6 w-6 mr-2" />
                Customers
              </NavLink>
              <NavLink
                to="/admin/products"
                className="flex mb-3 items-center text-blue-600"
              >
                <ShoppingBagIcon className="h-6 w-6 mr-2" />
                Products
              </NavLink>
              <NavLink
                to="/admin/orders"
                className="flex mb-3 items-center text-blue-600"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
                Orders
              </NavLink>

              <NavLink
                to="/admin/payments"
                className="flex mb-3 items-center text-blue-600"
              >
                <CreditCardIcon className="h-6 w-6 mr-2" />
                Payments
              </NavLink>

              <NavLink
                to="/admin/product/add"
                className="flex mb-3 items-center text-blue-600"
              >
                <PlusIcon className="h-6 w-6 mr-2" />
                Add Product
              </NavLink>
            </nav>
          </div>
          <div
            className="flex-grow bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow ml-0 md:ml-64">
        <div className="pt-16 md:pt-0 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
