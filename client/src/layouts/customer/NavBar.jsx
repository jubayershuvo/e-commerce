"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import DarkMode from "../../components/DarkMode";
import MiniProfile from "../../components/MiniProfile";
import { useDispatch, useSelector } from "react-redux";
import { setCartOpen, setCurrency } from "../../store/usersSlice";
import Cart from "../../pages/customer/Cart";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import SearchProduct from "../../components/SearchProduct";
import { logout } from "../../store/authSlice";

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          imageSrc:
            "https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          imageSrc:
            "https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", to: "tops" },
            { name: "Dresses", to: "dresses" },
            { name: "Pants", to: "pants" },
            { name: "Denim", to: "denim" },
            { name: "Sweaters", to: "sweaters" },
            { name: "T-Shirts", to: "t-shirts" },
            { name: "Jackets", to: "jackets" },
            { name: "Activewear", to: "activewear" },
            { name: "Browse All", to: "all" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", to: "watches" },
            { name: "Wallets", to: "wallets" },
            { name: "Bags", to: "bags" },
            { name: "Sunglasses", to: "sunglasses" },
            { name: "Hats", to: "hats" },
            { name: "Belts", to: "belts" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", to: "full-nelson" },
            { name: "My Way", to: "my-way" },
            { name: "Re-Arranged", to: "re-arranged" },
            { name: "Counterfeit", to: "counterfeit" },
            { name: "Significant Other", to: "significant-other" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          imageSrc:
            "https://tailwindui.com/plus/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          imageSrc:
            "https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", to: "tops" },
            { name: "Pants", to: "pants" },
            { name: "Sweaters", to: "sweaters" },
            { name: "T-Shirts", to: "t-shirts" },
            { name: "Jackets", to: "jackets" },
            { name: "Activewear", to: "activewear" },
            { name: "Browse All", to: "all" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", to: "watches" },
            { name: "Wallets", to: "wallets" },
            { name: "Bags", to: "bags" },
            { name: "Sunglasses", to: "sunglasses" },
            { name: "Hats", to: "hats" },
            { name: "Belts", to: "belts" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", to: "re-arranged" },
            { name: "Counterfeit", to: "counterfeit" },
            { name: "Full Nelson", to: "full-nelson" },
            { name: "My Way", to: "my-way" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Posts", to: "posts" },
    { name: "About", to: "about" },
  ],
};

function NavBar() {
  const dispatch = useDispatch();
  const currencies = ["BDT"];
  const { cartList, currency } = useSelector((state) => state?.Users);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [navigation, setNavigation] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    if(isLoggedIn === true){
      const checkLocalCookie = async() => {
        const cookies = document.cookie.split('; ');
        const cookieName = 'accessVerify';
        const exists = cookies.some(cookie => cookie.startsWith(`${cookieName}=`));
        if (exists) {
          return;
        } else {
          try {
            await axios.post('/user/refresh-token', {refreshToken: user.refreshToken});
          } catch (error) {
            console.log(error)
            dispatch(logout())
          }
        }
      };
  
      checkLocalCookie();
    }
    return
  });

  useEffect(() => {
    async function fetch() {
      try {
        const res = await axios.get('/user/menu');
        setNavigation(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [])
  

  return (
    <div className="bg-white dark:bg-gray-900">
      <Toaster position="top-center" />
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-40 lg:hidden custom-scrollbar"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white dark:bg-gray-800 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full custom-scrollbar"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation?.categories?.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 dark:text-gray-100 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation?.categories?.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    {/* <div className="grid grid-cols-2 gap-x-4">
                      {category.featured?.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:opacity-75 custom-scrollbar">
                            <img
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              className="object-cover object-center"
                            />
                          </div>
                          <NavLink
                            onClick={() => setOpen(false)}
                            to={item.to}
                            className="mt-6 block font-medium text-gray-900 dark:text-gray-100"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </NavLink>
                          <p
                            aria-hidden="true"
                            className="mt-1 dark:text-gray-400"
                          >
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div> */}
                    {category.sections?.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-gray-900 dark:text-gray-100"
                        >
                          {section.name}
                        </p>
                        <ul
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items?.map((item) => (
                            <li key={item.name} className="flow-root">
                              <NavLink
                                onClick={() => setOpen(false)}
                                to={`/products/${category.id}/${section.id}/${item.to}`}
                                className="-m-2 block p-2 text-gray-500 dark:text-gray-400"
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 px-4 py-6">
              {navigation?.pages?.map((page) => (
                <div key={page.name} className="flow-root">
                  <NavLink
                    onClick={() => setOpen(false)}
                    to={page.to}
                    className="-m-2 block p-2 font-medium text-gray-900 dark:text-gray-100"
                  >
                    {page.name}
                  </NavLink>
                </div>
              ))}
            </div>

            {isLoggedIn === false && (
              <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                <div className="flow-root">
                  <Link
                    onClick={() => setOpen(false)}
                    to={"/login"}
                    className="-m-2 block p-2 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Sign in
                  </Link>
                </div>
                <div className="flow-root">
                  <Link
                    onClick={() => setOpen(false)}
                    to={"/register"}
                    className="-m-2 block p-2 font-medium text-gray-900 dark:text-gray-100"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
              <div className="flex items-center text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200">
                <select
                  value={currency}
                  onChange={(e) => dispatch(setCurrency(e.target.value))}
                  className="block md:hidden text-base focus:outline-none border-none dark:bg-slate-800 font-medium"
                >
                  {currencies?.map((currency) => (
                    <option key={currency} className="flex" value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <span className="sr-only">, change currency</span>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white dark:bg-gray-800">
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden dark:bg-gray-800 dark:text-gray-300"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src={"/logo.png"}
                    className="h-6 w-auto"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation?.categories?.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 ease-out hover:text-gray-800 dark:hover:text-gray-200 data-[open]:border-indigo-600 data-[open]:text-indigo-600">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute z-50 inset-x-0 top-full text-sm text-gray-500 dark:text-gray-400 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white dark:bg-gray-800 shadow"
                        />

                        <div className="relative bg-white dark:bg-gray-800">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              {/* <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured?.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:opacity-75 custom-scrollbar">
                                      <img
                                        alt={item.imageAlt}
                                        src={item.imageSrc}
                                        className="object-cover object-center"
                                      />
                                    </div>
                                    <button
                                      onClick={() => setOpen(false)}
                                      className="mt-6 block font-medium text-gray-900 dark:text-gray-100"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </button>
                                    <p
                                      aria-hidden="true"
                                      className="mt-1 dark:text-gray-400"
                                    >
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div> */}
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections?.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="font-medium text-gray-900 dark:text-gray-100"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items?.map((item) => (
                                        <li key={item.name} className="flex">
                                          <NavLink
                                            onClick={() => setOpen(false)}
                                            to={`/products/${category.id}/${section.id}/${item.to}`}
                                            className="hover:text-gray-800 dark:hover:text-gray-200"
                                          >
                                            {item.name}
                                          </NavLink>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation?.pages?.map((page) => (
                    <NavLink
                      key={page.name}
                      to={page.to}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
                    >
                      {page.name}
                    </NavLink>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {isLoggedIn === false && (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    <Link
                      onClick={() => setOpen(false)}
                      to={"/login"}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
                    >
                      Sign in
                    </Link>
                    <span
                      aria-hidden="true"
                      className="h-6 w-px bg-gray-200 dark:bg-gray-700"
                    />
                    <Link
                      onClick={() => setOpen(false)}
                      to={"/register"}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
                    >
                      Create account
                    </Link>
                  </div>
                )}

                <div className="hidden md:ml-8 md:flex">
                  <div className="flex items-center text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200">
                    <select
                      value={currency}
                      onChange={(e) => dispatch(setCurrency(e.target.value))}
                      className="ml-3 block text-base focus:outline-none border-none dark:bg-slate-800 font-medium"
                    >
                      {currencies?.map((currency) => (
                        <option
                          key={currency}
                          className="flex"
                          value={currency}
                        >
                          {currency}
                        </option>
                      ))}
                    </select>
                    <span className="sr-only">, change currency</span>
                  </div>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <div onClick={()=>setIsPopupOpen(!isPopupOpen)} className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </div>
                  <SearchProduct isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}/>
                </div>

                {/* Cart */}
                <div
                  onClick={() => dispatch(setCartOpen())}
                  className="ml-4 flow-root lg:ml-6"
                >
                  <button className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200">
                      {cartList.length > 0 ? cartList.length : 0}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
                <div className="ml-2 mt-1">
                  <DarkMode />
                </div>
                {isLoggedIn === true && (
                  <div className="pl-2 mt-2 lg:pr-0">
                    <MiniProfile />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Cart />
    </div>
  );
}
export default NavBar;