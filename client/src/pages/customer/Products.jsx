"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { Link } from "react-alice-carousel";
import ProductCard from "../customer/ProductCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const sortOptions = [
  { name: "Most Popular", to: "#", current: true },
  { name: "Best Rating", to: "#", current: false },
  { name: "Newest", to: "#", current: false },
  { name: "Price: Low to High", to: "#", current: false },
  { name: "Price: High to Low", to: "#", current: false },
];
const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: false },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: false },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const { genderID, categoryID, subcategoryID } = useParams();

  console.log(genderID, categoryID, subcategoryID)

  const handleFilters = (id, value) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.getAll(id);

    if (filterValue.length > 0 && filterValue[0].split(",").includes(value)) {
      // Remove the value if it exists
      filterValue = filterValue[0].split(",").filter((item) => item !== value);
    } else {
      filterValue.push(value);
    }

    // Update the search params or remove the param if empty
    if (filterValue.length > 0) {
      searchParams.set(id, filterValue.join(","));
    } else {
      searchParams.delete(id);
    }

    // Navigate to the updated query string
    const query = searchParams.toString();
    navigate({ search: query.length ? `?${query}` : "" });
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const productApi =
        genderID && categoryID && subcategoryID
          ? `/product/${genderID}/${categoryID}/${subcategoryID}`
          : "/product/all";
      try {
        // Submit the data if validation passed
        const response = await axios.get(productApi);

        if (response?.data?.data) {
          // Proceed to the next step after success
          setProducts(response.data.data);
        } else {
          console.log("Error adding address. Please try again.");
        }
      } catch (error) {
        console.log("Error during address submission: ", error);
      }
    }
    fetch();
  }, [genderID, categoryID, subcategoryID]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 custom-scrollbar">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden custom-scrollbar"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0 custom-scrollbar"
          />

          <div className="fixed inset-0 z-40 flex custom-scrollbar">
            <DialogPanel
              transition
              className="relative custom-scrollbar ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white dark:bg-gray-800 py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full custom-scrollbar"
            >
              <div className="flex items-center justify-between px-4 custom-scrollbar">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 dark:text-gray-300"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200 dark:border-gray-700 custom-scrollbar">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 custom-scrollbar"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="custom-scrollbar group flex w-full items-center justify-between bg-white dark:bg-gray-800 px-2 py-3 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden custom-scrollbar"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6 custom-scrollbar">
                      <div className="space-y-6 custom-scrollbar">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              onChange={() =>
                                handleFilters(section.id, option.value)
                              }
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500 dark:text-gray-300"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-8 custom-scrollbar">
          <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <Menu
                as="div"
                className="relative custom-scrollbar inline-block text-left"
              >
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-white"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none dark:bg-gray-800 dark:ring-opacity-20 data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1 custom-scrollbar">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <Link
                          to={option.to}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-300",
                            "block px-4 py-2 text-sm data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-700"
                          )}
                        >
                          {option.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section
            aria-labelledby="products-heading"
            className="pb-24 pt-6 custom-scrollbar"
          >
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 min-w-7xl lg:max-h-screen">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6 dark:border-gray-700"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4 custom-scrollbar">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              onChange={() =>
                                handleFilters(section.id, option.value)
                              }
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-400"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="grid lg:col-span-3 lg:h-2/5 overflow-y-scroll custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  lg:row-span-2  gap-6">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className={`relative w-72 lg:w-72 max-w-96 mx-auto hover:scale-105 hover:shadow-xl hover:z-50 transform transition-transform duration-300`}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
