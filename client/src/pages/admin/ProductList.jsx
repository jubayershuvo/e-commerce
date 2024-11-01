import React, { useEffect, useState } from "react";
import axios from "axios"; // For making HTTP requests
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import UpdateProduct from "../../components/UpdateProduct";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  // Fetch the product list from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product/all"); // Replace with your API endpoint
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {product._id ? (
        <div>
          <UpdateProduct product={product} setProduct={setProduct}/>
        </div>
      ) : (
        <div className="h-screen overflow-y-scroll custom-scrollbar bg-white dark:bg-gray-900 p-4 shadow-md mx-auto">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Product List
          </h2>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="relative justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={product.imageUrl || "product.png"}
                    alt={product.imageAlt}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="text-sm text-gray-900 dark:text-gray-300">
                    <h3 className="text-sm md:text-lg font-semibold">
                      {product.title} (ID:{product._id})
                    </h3>
                    {product.discount > 0 ? (
                      <p className="text-xs text-green-500">
                        {product.discount}% Off
                      </p>
                    ) : null}
                    {product.availableSize.length > 1 ? (
                      <p className="text-xs">
                        Available Sizes: {product.availableSize.join(", ")}
                      </p>
                    ) : (
                      <p className="h-3"> </p>
                    )}
                    {product.price !== product.regularPrice && (
                      <p className="md:text-sm text-xs font-semibold opacity-50 line-through">
                        {product.regularPrice?.toFixed(2)} BDT
                      </p>
                    )}
                    <p className="md:text-sm text-xs font-semibold">
                      {product.price?.toFixed(2)} BDT
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 bottom-4">
                  <div
                  onClick={()=> setProduct(product)}
                   className="flex items-center space-x-2 cursor-pointer">
                    <PencilSquareIcon
                      width={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-900 dark:text-white">No products found</p>
          )}
        </div>
      )}
    </>
  );
};

export default ProductList;
