import * as React from "react";
import { FaEdit, FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";
import axios from "axios";
import { login } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DeliveryAddress({ handleNext, user }) {
  const navigate = useNavigate();
  const {  
    cartList, 
   } = useSelector(
    (state) => state?.Users
  );
  React.useEffect(() => {
    if(cartList.length === 0){
      navigate("/products")
    }
  }, [cartList, navigate])
  
  const availableCountry = [
    { country: "United State" },
    { country: "United Kingdom" },
    { country: "Bangladesh" },
  ];
  const availableCountryCode = [
    { value: "+1", label: "US +1" },
    { value: "+44", label: "Uk +44" },
    { value: "+880", label: "BD +880" },
  ];
  const oldAddress = user?.shippingAddress;
  const [data, setData] = React.useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    countryCode: "",
    mobileNumber: "",
    city: "",
    zip: "",
    state: "",
    country: "",
  });
  const dispatch = useDispatch();
  const openFields = oldAddress?.firstName ? false : true;
  const [isFieldsOpen, setIsFieldsOpen] = React.useState(openFields);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { key: "firstName", message: "Enter First Name" },
      { key: "lastName", message: "Enter Last Name" },
      { key: "address1", message: "Enter Address Line 1" },
      { key: "countryCode", message: "Enter Country Code" },
      { key: "mobileNumber", message: "Enter Mobile No." },
      { key: "city", message: "Enter City" },
      { key: "zip", message: "Enter Zip Code" },
      { key: "country", message: "Enter Country" },
      { key: "state", message: "Enter State" },
    ];

    // Validate form fields
    for (let field of requiredFields) {
      if (!data[field.key]) {
        console.log(field.message);
        return; // Exit if a required field is missing
      }
    }

    try {
      // Submit the data if validation passed
      const response = await axios.post("/address/add", data, {
        withCredentials: true,
      });

      if (response?.data?.data) {
        dispatch(login(response.data.data));
        handleNext(); // Proceed to the next step after success
      } else {
        console.log("Error adding address. Please try again.");
      }
    } catch (error) {
      console.log("Error during address submission: ", error);
    }
  };
  const { isLoggedIn } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return (
    <>
      {isFieldsOpen === false ? (
        <div className="p-6 max-w-md mx-auto mt-4">
          <div className="mx-auto text-center">
            <h1 className="inline-block text-center text-base md:text-lg mx-auto my-2">
              Old address
            </h1>
          </div>
          <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all border dark:border-gray-700">
            <div className="text-center mb-4">
              <div className="flex justify-center items-center space-x-2">
                <FaUser
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-200">
                  {oldAddress?.firstName + " " + oldAddress?.lastName}
                </h2>
              </div>
              <hr className="mt-2 border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mr-3" />
                <div className="leading-relaxed">
                  <div className="flex">
                    <p>{oldAddress?.address2 + " " + oldAddress?.address1}</p>
                  </div>
                  <p>
                    {oldAddress?.city}, {oldAddress?.state} {oldAddress?.zip}
                  </p>
                  <p>{oldAddress?.country}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-blue-600 dark:text-blue-400 mr-3" />
                <p className="font-semibold">
                  {oldAddress?.countryCode + oldAddress?.mobileNumber}
                </p>
              </div>
              <div className="bold absolute bottom-0 right-0">
                <FaEdit
                  className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-600"
                  size={20}
                  onClick={() => setIsFieldsOpen(true)} // You can pass an edit function through props
                />
              </div>
            </div>
          </div>
          {/* Submit Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleNext}
              type="button"
              className="py-3 px-6 mx-auto bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center items-center px-5 py-10">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-2xl">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
              Shipping Address
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    onChange={handleChange}
                    value={data.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder={oldAddress?.firstName || "First Name"}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    onChange={handleChange}
                    value={data.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={oldAddress?.lastName || "Last Name"}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="mt-6">
                <label
                  className="text-gray-700 dark:text-gray-300 mb-2 block text-sm md:text-base"
                  htmlFor="address1"
                >
                  Address Line 1
                </label>
                <input
                  onChange={handleChange}
                  value={data.address1}
                  type="text"
                  id="address1"
                  name="address1"
                  placeholder={oldAddress?.address1 || "Address Line 1"}
                  className="p-3 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                />
              </div>

              {/* Address Line 2 */}
              <div className="mt-6">
                <label
                  className="text-gray-700 dark:text-gray-300 mb-2 block text-sm md:text-base"
                  htmlFor="address2"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  onChange={handleChange}
                  value={data.address2}
                  type="text"
                  id="address2"
                  name="address2"
                  placeholder={oldAddress?.address2 || "Address Line 2"}
                  className="p-3 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                />
              </div>
              {/* Mobile no. */}
              <div className="mt-6">
                <label
                  className="text-gray-700 dark:text-gray-300 mb-2 block text-sm md:text-base"
                  htmlFor="countryCode"
                >
                  Mobile No.
                </label>
                <div className="flex">
                  <select
                    onChange={handleChange}
                    value={data.countryCode}
                    id="countryCode"
                    name="countryCode"
                    className={`${
                      availableCountryCode.length > 0
                        ? "opacity-90"
                        : "opacity-50 pointer-events-none"
                    } p-3 mr-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500`}
                  >
                    <option>
                      {availableCountryCode.length > 0
                        ? "Country Code"
                        : "No countries available"}
                    </option>
                    {availableCountryCode &&
                      availableCountryCode.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                  </select>
                  <input
                    onChange={handleChange}
                    value={data.mobileNumber}
                    type="number"
                    maxLength={10}
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder={oldAddress?.mobileNumber || "Mobile No."}
                    className="p-3 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 no-spinner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* City */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    onChange={handleChange}
                    value={data.city}
                    type="text"
                    id="city"
                    name="city"
                    placeholder={oldAddress?.city || "City"}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Zip Code */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="zip"
                  >
                    Zip Code
                  </label>
                  <input
                    onChange={handleChange}
                    value={data.zip}
                    type="text"
                    id="zip"
                    name="zip"
                    placeholder={oldAddress?.zip || "Zip"}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Country */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <select
                    onChange={handleChange}
                    value={data.country}
                    id="country"
                    name="country"
                    className={`${
                      availableCountry.length > 0
                        ? "opacity-90"
                        : "opacity-50 pointer-events-none"
                    } p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500`}
                  >
                    <option>
                      {availableCountry.length > 0
                        ? "Select a country"
                        : "No countries available"}
                    </option>
                    {availableCountry &&
                      availableCountry.map((country) => (
                        <option key={country.country} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                  </select>
                </div>

                {/* State */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-700 dark:text-gray-300 mb-2 text-sm md:text-base"
                    htmlFor="state"
                  >
                    State/Province
                  </label>
                  <input
                    onChange={handleChange}
                    value={data.state}
                    type="text"
                    id="state"
                    name="state"
                    placeholder={oldAddress?.state || "State"}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                {oldAddress?.firstName && (
                  <button
                    onClick={() => setIsFieldsOpen(false)}
                    type="button"
                    className="py-3 px-6 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-500"
                  >
                    Use Old Address
                  </button>
                )}

                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DeliveryAddress;
