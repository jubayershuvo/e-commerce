import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../customer/ProductCard";
import { useParams } from "react-router-dom";

const sortOptions = [
  { name: "Newest first", to: "new", current: false },
  { name: "Oldest first", to: "old", current: false },
  { name: "Low to High", to: "low", current: false },
  { name: "High to Low", to: "high", current: false },
];

export default function Products() {
  const { genderID, categoryID, subcategoryID } = useParams();

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState(sortOptions[0].to);


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

  useEffect(() => {
    const sortedProducts = [...products]; // Create a shallow copy of the products array

    if (sortBy === "new") {
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "old") {
      sortedProducts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortBy === "high") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "low") {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    // Update state with the sorted array
    setProducts(sortedProducts);
    return;
  }, [sortBy]);


  return (
    <div className="bg-white dark:bg-gray-800 custom-scrollbar">
      <div>
  
        <main className="mx-auto px-4 sm:px-6 lg:px-8 custom-scrollbar">
          <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Products
            </h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                  }}
                  className="appearance-none px-8 group inline-flex justify-center text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-800 rounded-md py-2 shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-opacity-20"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.name}
                      value={option.to}
                      className={
                        option.current
                          ? "font-medium text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-300"
                      }
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
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
            

              {/* Product grid */}
              <div className="grid lg:col-span-4 lg:h-full overflow-y-scroll custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  lg:row-span-2  gap-6">
                  {products.length > 0 ? products.map((product, index) => (
                    <div
                      key={index}
                      className={`relative w-72 lg:w-72 max-w-96 mx-auto hover:scale-105 hover:shadow-xl hover:z-50 transform transition-transform duration-300`}
                    >
                      <ProductCard product={product} />
                    </div>
                  )):(
                    <p className="mt-10">No products here</p>
                  )
                }
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
