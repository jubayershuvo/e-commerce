"use client";

import React, { useEffect, useState } from "react";
import axios from "axios"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartClose, setCartList, setDiscount, setDiscountCupon, setDiscountedCuponPrice, setPayableAmount } from "../../store/usersSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const { 
    isCartOpen, 
    currency, 
    cartList, 
    payableAmount, 
    discount, 
    discountCupon, 
    discountedCuponPrice
   } = useSelector(
    (state) => state?.Users
  );
  const products = cartList;

  const [regularPrice, setRegularPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cupon, setCupon] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      let prices = 0;
      let regularPrices = 0;
      products.forEach((product) => {
        regularPrices += product.regularPrice * product.quantity;
        prices += product.price * product.quantity;
      });
      setRegularPrice(regularPrices.toFixed(2));
      setTotalPrice(prices.toFixed(2));
    }
  }, [products]);

  useEffect(() => {
    if (regularPrice !== totalPrice) {
      if (discountCupon > 0) {
        dispatch(setDiscount((regularPrice - totalPrice).toFixed(2)));
        dispatch(setPayableAmount(
          (totalPrice - (totalPrice / 100) * discountCupon).toFixed(2)
        ));
        dispatch(setDiscountedCuponPrice((totalPrice - payableAmount).toFixed(2)));
      } else {
        dispatch(setPayableAmount(totalPrice));
        dispatch(setDiscount((regularPrice - totalPrice).toFixed(2)));
      }
    } else {
      if (discountCupon > 0) {
        dispatch(setDiscount(0));
        dispatch(setPayableAmount((totalPrice - (totalPrice / 100) * discountCupon).toFixed(2)));
        dispatch(setDiscountedCuponPrice((totalPrice - payableAmount).toFixed(2)));
      } else {
       dispatch( setPayableAmount(totalPrice));
        dispatch(setDiscount(0));
      }
    }
  }, [regularPrice, totalPrice, discountCupon, payableAmount, dispatch]);
const [couponLoading,setCouponLoading] = useState(false)
  const handleCupon = async(e) => {
    e.preventDefault();
    if (discountedCuponPrice <= 0) {
      setCouponLoading(true)
      try {
        const res = await axios.get(`/order/coupon/${cupon}`)
        dispatch(setDiscountCupon(res.data.data.discount));
        setCouponLoading(false)
      } catch (error) {
        console.log(error)
        setCouponLoading(false)
      }

      
    }
  };
  const handleCopy = (index) => {
    if (products.some((product, i) => i === index)) {
      const copiedProduct = { ...products[index] }; // Make a copy of the selected product
      const newProducts = [...cartList, copiedProduct]; // Append it to the cart list
      dispatch(setCartList(newProducts)); // Dispatch the updated cart list
    }
  };
  const handleRemove = (index) => {
    if (products.some((product, i) => i === index)) {
      const newProducts = products.filter((product, i) => i !== index);
      dispatch(setCartList(newProducts));
    }
  };
  const incrementQuantity = (index) => {
    const updatedCartList = cartList.map((product, i) =>
      i === index ? { ...product, quantity: product.quantity + 1 } : product
    );
    dispatch(setCartList(updatedCartList)); // Dispatch the updated cart list
  };
  const handleSize = (index, value) => {
    const updatedCartList = cartList.map((product, i) =>
      i === index ? { ...product, selectedSize: value } : product
    );
    dispatch(setCartList(updatedCartList)); // Dispatch the updated cart list
  };
  const decrementQuantity = (index) => {
    const updatedCartList = cartList.map((product, i) =>
      i === index ? { ...product, quantity: product.quantity - 1 } : product
    );
    dispatch(setCartList(updatedCartList)); // Dispatch the updated cart list
  };
  return (
    <>
      {isCartOpen && (
        <div
          onClick={() => dispatch(setCartClose())}
          className="fixed top-0 left-0 z-40 w-screen h-screen overflow-hidden opacity-50 bg-black"
        />
      )}
      <div
        className={`w-[22rem] md:w-[30rem] text-xs md:text-base transition duration-300 ease-in-out fixed ${
          isCartOpen ? "right-0" : "-right-[35rem]"
        } top-0 z-40 bg-white dark:bg-gray-900`}
      >
        <div className="w-full relative h-screen ">
          <div className="absolute top-0 w-full px-6 pt-4">
            <div className="flex items-start justify-between h-[3.5rem]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Shopping cart
              </h3>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  onClick={() => dispatch(setCartClose())}
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <>
              <div className="absolute top-[4rem] w-full h-3/5 px-6 overflow-y-auto custom-scrollbar">
                <div className="flex-1 w-full sm:px-6">
                  <div className="mt-8">
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((product, i) => (
                          <li key={i} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <img
                                alt={product.imageAlt}
                                src={product.imageUrl}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between font-medium text-gray-900 dark:text-gray-100">
                                  <h3>
                                    <Link to={product.to}>{product.title}</Link>
                                  </h3>
                                  <div className="">
                                    <p className="ml-4">{`${(
                                      product.price * product.quantity
                                    ).toFixed(2)} ${currency}`}</p>
                                    <p className="ml-4 opacity-55 line-through">
                                      {`${(
                                        product.regularPrice * product.quantity
                                      ).toFixed(2)} ${currency}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  {product.availableSize && (
                                    <select
                                      value={product.selectedSize}
                                      onChange={(e) =>
                                        handleSize(i, e.target.value)
                                      }
                                      className="bg-white dark:bg-slate-900 border-none"
                                    >
                                      {product.availableSize.map((size) => (
                                        <option value={size} key={size}>
                                          {size}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex text-gray-500 dark:text-gray-400">
                                  <button
                                    onClick={() => decrementQuantity(i)}
                                    className={`font-bold mx-1 w-4 h-4 border-black ${
                                      product.quantity < 2 &&
                                      "opacity-55 pointer-events-none"
                                    }`}
                                  >
                                    -
                                  </button>
                                  <p>Qty {product.quantity}</p>
                                  <button
                                    onClick={() => incrementQuantity(i)}
                                    className="font-bold mx-1 w-4 h-4"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRemove(i)}
                                    type="button"
                                    className="font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                                  >
                                    Remove
                                  </button>

                                  <button
                                    onClick={() => handleCopy(i)}
                                    type="button"
                                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t absolute bottom-0 w-full h-1/3 bg-white dark:bg-slate-900 z-50 border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                  <p>Total price</p>
                  <p>{`${regularPrice} ${currency}`}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                  <p>Discount</p>
                  <p>-{`${discount} ${currency}`}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                  <p>Cupon</p>
                  <p>-{`${discountedCuponPrice} ${currency}`}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                  <p>Payable Amount</p>
                  <p>{`${payableAmount} ${currency}`}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="gap-3 grid grid-cols-7 grid-rows-1 mx-auto pt-4">
                  <input
                    disabled={discountCupon === 0 ? false : true}
                    onChange={(e) => setCupon(e.target.value)}
                    value={cupon}
                    type="text"
                    placeholder="Coupon code"
                    className="col-span-4 disabled:opacity-50 row-span-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {discountCupon === 0 ? <button
                    onClick={handleCupon}
                    disabled={couponLoading ? true:false}
                    className="col-span-3 disabled:opacity-50 row-span-1 text-sm py-2 md:text-base bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    Apply Cupon
                  </button>: <button
                    onClick={()=> {
                      dispatch(setDiscountCupon(0))
                      dispatch(setDiscountedCuponPrice(0))

                    }}
                    className="col-span-3 disabled:opacity-50 row-span-1 text-sm py-2 md:text-base bg-red-600 text-white dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:red-blue-500 transition-all"
                  >
                    Remove Cupon
                  </button>}
                </div>

                <div className="mt-6">
                  <Link
                    to={'/checkout?step=1'}
                    onClick={() => dispatch(setCartClose())}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute w-full translate-y-60 dark:text-white">
                <div className="mx-auto text-center">
                  <h1>No item in cart please shop first</h1>
                  <Link
                    to={"/products"}
                    onClick={() => dispatch(setCartClose())}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
