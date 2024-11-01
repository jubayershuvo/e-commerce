import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartList } from "../../store/usersSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartList, currency } = useSelector((state) => state?.Users);
  const handleAddToCart = (fullProduct) => {
    const cartItem = {
      _id: fullProduct._id,
      title: fullProduct.title,
      description: fullProduct.description,
      regularPrice: fullProduct.regularPrice,
      price: fullProduct.price,
      discount: fullProduct.discount,
      imageUrl: fullProduct.imageUrl,
      availableSize: fullProduct.availableSize,
      selectedSize: fullProduct.selectedSize,
      imageAlt: "product",
      quantity: 1,
    };
    if (cartList.some((product) => product._id === cartItem._id)) {
      alert("already added");
    } else {
      dispatch(setCartList([...(cartList || []), cartItem]));
    }
  };
  return (
    <div className="bg-white relative text-xs z-50 md:text-base dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transform hover:scale-105 transition duration-300">
      {product.inStock === true && (
        <div className="bg-transparent text-right w-20 h-20 absolute z-50 -right-6 top-0 rounded-lg">
          {product.discount > 0 && (
            <div className="w-14 h-6 bg-orange-400 rounded-lg text-center p-1">
              <p className="text-green-900 text-xs">{product.discount}% Off</p>
            </div>
          )}
        </div>
      )}
      <div
        className="w-full cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          className="w-full h-48 object-cover object-center transform hover:rotate-1 transition duration-300"
          src={product.imageUrl}
          alt={product.title}
        />
        <div className="p-4 flex-grow">
          <h2 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold">
            {product.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {product.inStock === true ? (
            <>
              <div className="flex-row">
                <p className="text-gray-900 pl-1 text-sm dark:text-gray-300 font-bold">
                  {`${product.price} ${currency}`}
                </p>
                {product.discount > 0 && (
                  <p className="text-gray-900 px-1 opacity-70 line-through dark:text-gray-300 font-bold text-xs">
                    {`${product.regularPrice} ${currency}`}
                  </p>
                )}
              </div>
              {cartList.some((p) => p._id === product._id) ? (
                <button
                  className="px-3 opacity-45 py-1 w-32 bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold uppercase rounded hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                  disabled
                >
                  Added
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-1 w-32 bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold uppercase rounded hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                >
                  Add to Cart
                </button>
              )}
            </>
          ) : (
            <p className="text-red-500 mx-auto">Out of stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
