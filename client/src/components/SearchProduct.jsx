import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";

export default function SearchProduct({ isPopupOpen, setIsPopupOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  // Fetch products from API based on the search term
  const fetchProducts = async (query) => {
    try {
      
      setLoading(true);
      const response = await axios.get(`/product/products/${query}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    if(isPopupOpen){
      setSearchTerm("")
      setProducts([])
    }
  }, [isPopupOpen])
  

  // Debounced search handler
  const handleSearchChange = debounce((query) => {
    if (query) fetchProducts(query);
    else setProducts([]);
  }, 300);

  const onInputChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearchChange(e.target.value);
  };

  return (
    isPopupOpen && (
      <div className="absolute top-12 right-0 w-80 z-50 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={onInputChange}
            placeholder="Search products..."
            className="w-full p-2 border rounded-md focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => setIsPopupOpen(false)}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {loading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          )}

          {/* Render each product */}
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              onClick={() => {
                setIsPopupOpen(false);
              }}
              className="p-2 flex overflow-hidden text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img src={product.imageUrl} alt="product" className="h-10 my-1" />
              <div className="">
                <p className="w-full px-2 text-sm md:text-base">
                  {product.title}
                </p>
                <div className="flex">
                  <p className="ml-3 text-xs md:text-sm opacity-55 line-through">
                    {product.regularPrice} BDT
                  </p>
                  <p className="ml-1 text-xs md:text-sm">{product.price} BDT</p>
                </div>
              </div>
            </Link>
          ))}

          {/* No results found */}
          {!loading && products.length === 0 && searchTerm && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No results found
            </p>
          )}
        </div>
      </div>
    )
  );
}
