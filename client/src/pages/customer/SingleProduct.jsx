import React, { useEffect } from "react";
import { useState } from "react";
import ProductRatings from "../../components/ProductReting";
import { useDispatch, useSelector } from "react-redux";
import { setCartList } from "../../store/usersSlice";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const [product, setProduct] = useState({})
  const { cartList, currency } = useSelector((state) => state?.Users);
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [selectedSize, setSelectedSize] = useState(product.selectedSize);
  const totalReviews = product.reviews?.length;
  const [totalStar, setTotalStar] = useState(0);
  useEffect(() => {
    if (totalReviews > 0) {
      let stars = 0;
      product.reviews.map((review) => (stars += Number(review.star)));
      setTotalStar(0);
      setTotalStar(stars);
    } else {
      setTotalStar(0);
    }
  }, [setTotalStar, product.reviews, totalReviews]);

  const averageStar = Math.round((totalStar / totalReviews).toFixed(1) * 2) / 2;
  const cartItem = { ...product, quantity: 1, selectedSize: selectedSize };
  const addToCart = () => {
    delete cartItem.images;
    delete cartItem.reviews;
    if (cartList.some((product) => product._id === cartItem._id)) {
      alert("already added");
    } else {
      dispatch(setCartList([...(cartList || []), cartItem]));
    }
  };
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if(_id){
      setLoading(true)
      async function fetch() {
        try {
          const response = await axios.get(`/product/single/${_id}`);
          setProduct(response.data.data)
          setSelectedImage(response.data.data.imageUrl)
          setSelectedSize(response.data.data.selectedSize)
          setLoading(false)
        } catch (error) {
          console.log(error?.response?.data?.message)
          setLoading(false)
        }
      }
      fetch()
    }
  }, [_id])
if(loading){
  return (
    <h1>Loading...</h1>
  )
}
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-[25rem] h-[25rem] md:w-[50rem] md:h-[50rem] object-cover object-center rounded-lg"
          />
          <div className="grid grid-cols-3 gap-4">
            {/* Thumbnail Images */}
            <img
              onClick={() => setSelectedImage(product.imageUrl)}
              src={product?.imageUrl}
              alt="Product"
              className={`lg:w-60 lg:h-60 md:w-60 md:h-60 w-28 h-28 object-cover object-center  rounded-lg ${
                selectedImage === product.imageUrl && "border-red-500"
              }`}
            />
            {product.images?.length > 0 &&
              product.images.map((image, index) => (
                <img
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  src={image}
                  alt="Product"
                  className={`lg:w-60 lg:h-60 md:w-60 md:h-60 w-28 h-28 object-cover object-center  rounded-lg ${
                    selectedImage === image && "border-red-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex">
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {`${product.price} ${currency}`}
            </p>
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mx-2 opacity-75 line-through">
              {`${product.regularPrice} ${currency}`}
            </p>
            <p className="text-xl ml-1 font-semibold text-green-600 dark:text-green-400">
              {product.discount}% off
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }, (v, i) => {
                const starValue = i + 1;
                return (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill={
                      averageStar >= starValue
                        ? "currentColor" // Full star
                        : averageStar >= starValue - 0.5
                        ? "url(#half)" // Half star
                        : "lightgray" // Empty star
                    }
                  >
                    {/* Define a gradient for the half-star fill */}
                    <defs>
                      <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="lightgray" />
                      </linearGradient>
                    </defs>
                    <path d="M9.049 2.927a.75.75 0 011.414 0l2.012 4.074 4.5.654a.75.75 0 01.415 1.279l-3.257 3.176.768 4.48a.75.75 0 01-1.088.79L10 14.347l-4.022 2.113a.75.75 0 01-1.088-.79l.768-4.48L2.4 8.934a.75.75 0 01.415-1.279l4.5-.654 2.012-4.074z" />
                  </svg>
                );
              })}
            </div>
            <p className="mx-2">
              Rated {averageStar ? averageStar.toFixed(1): 0} stars by {totalReviews} reviews
            </p>
          </div>

          {/* Size Options */}
          {product?.availableSize?.length > 1 && <div className="space-y-2">
            <h3 className="font-semibold">Size</h3>
            <div className="flex space-x-2">
              {product.availableSize &&
                product.availableSize.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? "border-indigo-600 dark:border-indigo-400"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>}

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={cartList.some((product) => product._id === cartItem._id)}
            className="w-full disabled:opacity-50 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white px-4 py-2 rounded-lg shadow-md"
          >
            {cartList.some((product) => product._id === cartItem._id)
              ? "Added"
              : "Add To Cart"}
          </button>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </div>

          {/* Policies */}
          <div className="grid grid-cols-2 gap-4 py-5">
            <div className="text-center">
              <p className="font-semibold">Free Shipping</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                On all orders over $50
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Easy Returns</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                30-day return policy
              </p>
            </div>
            <div className="col-span-2 my-5">
              <ProductRatings
                averageStar={averageStar}
                reviews={product.reviews}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl mb-3 font-bold">Recent Reviews</h2>
        <div className="space-y-4 max-h-96 overflow-y-scroll custom-scrollbar">
          {/* Reviews*/}

          {totalReviews > 0 ?
            product.reviews.map((review, i) => (
              <div
                key={i}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="font-semibold">{review.user?.fullname}</p>

                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }, (v, i) => {
                    const starValue = i + 1;
                    return (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill={
                          review.star >= starValue
                            ? "currentColor" // Full star
                            : review.star >= starValue - 0.5
                            ? "url(#half)" // Half star
                            : "lightgray" // Empty star
                        }
                      >
                        {/* Define a gradient for the half-star fill */}
                        <defs>
                          <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="lightgray" />
                          </linearGradient>
                        </defs>
                        <path d="M9.049 2.927a.75.75 0 011.414 0l2.012 4.074 4.5.654a.75.75 0 01.415 1.279l-3.257 3.176.768 4.48a.75.75 0 01-1.088.79L10 14.347l-4.022 2.113a.75.75 0 01-1.088-.79l.768-4.48L2.4 8.934a.75.75 0 01.415-1.279l4.5-.654 2.012-4.074z" />
                      </svg>
                    );
                  })}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {review.text}
                </p>
              </div>
            )):<h1>No reviews for this product</h1>}
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold">Customers also purchased</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-auto object-cover rounded-lg"
            />
            <p className="mt-2">Basic Tee - $20</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-auto object-cover rounded-lg"
            />
            <p className="mt-2">Gray Tee - $22</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-auto object-cover rounded-lg"
            />
            <p className="mt-2">Pink Tee - $25</p>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-auto object-cover rounded-lg"
            />
            <p className="mt-2">Black Tee - $20</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
