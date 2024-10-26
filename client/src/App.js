import React from "react";
import NavBar from "./layouts/customer/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import Footer from "./layouts/customer/Footer";
import Page404 from "./components/404";
import ProductPage from "./pages/customer/SingleProduct";
import CheckOut from "./pages/customer/CheckOut";
import Test from "./components/Test";
import MyOrders from "./pages/customer/MyOrders";
import MyOrderDetails from "./pages/customer/OrderDetails";
import OrderDetails from "./pages/admin/OrderDetails.jsx";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import Activate from "./pages/customer/Activate";
import AddProduct from "./pages/admin/AddProduct";
import ForgetPassword from "./pages/customer/ForgetPassword";
import VerifyForgetPassword from "./pages/customer/VerifyRequest.jsx";
import SetPassword from "./pages/customer/SetPassword.jsx";
import ChangePassword from "./pages/customer/ChangePassword.jsx";
import AdminNavbar from "./layouts/admin/AdminNavBar.jsx";
import Dashboard from "./pages/admin/Home.jsx";
import CustomerListPage from "./pages/admin/Customers.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import OrderList from "./pages/admin/OrderList.jsx";
import PaymentPage from "./pages/customer/Payment.jsx";
import PaymentInfo from "./pages/customer/PaymentInfo.jsx";
import PaymentList from "./pages/admin/PaymentList.jsx";
import PaymentDetails from "./pages/admin/PaymentDetails.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRouter />} />

        <Route path="/admin/*" element={<AdminRouter />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;

function UserRouter() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="activate" element={<Activate />} />

        <Route path="login" element={<Login />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:genderID/:categoryID/:subcategoryID" element={<Products />} />
        <Route path="checkout" element={<CheckOut />} />
        <Route path="payment/:_id" element={<PaymentPage />} />
        <Route path="paymentinfo" element={<PaymentInfo />} />
        <Route path="product/:_id" element={<ProductPage />} />
        <Route path="myorders" element={<MyOrders />} />
        <Route path="order/:_id" element={<MyOrderDetails />} />

        <Route path="forget-password" element={<ForgetPassword />} />
        <Route
          path="verify-forget-password"
          element={<VerifyForgetPassword />}
        />
        <Route path="set-password" element={<SetPassword />} />

        <Route path="change-password" element={<ChangePassword />} />
        <Route path="test" element={<Test />} />
      </Routes>
      <Footer />
    </>
  );
}
function AdminRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminNavbar />}>
          <Route index element={<Dashboard />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="products" element={<ProductList />} />
          <Route path="order/:_id" element={<OrderDetails />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="payment/:_id" element={<PaymentDetails />} />
        </Route>
        <Route path="login" element={<AdminLogin />} />
      </Routes>
    </>
  );
}
