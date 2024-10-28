import React, { useEffect, useState } from "react";

const ProductRatings = ({ reviews, averageStar }) => {
  const [ratingsCount, setRatingsCount] = useState({
    excellent: 0,
    veryGood: 0,
    good: 0,
    average: 0,
    poor: 0,
  });

  useEffect(() => {
    if (reviews?.length > 0) {
      const counts = reviews.reduce(
        (acc, review) => {
          if (review.star === 5) acc.excellent += 1;
          else if (review.star === 4) acc.veryGood += 1;
          else if (review.star === 3) acc.good += 1;
          else if (review.star === 2) acc.average += 1;
          else if (review.star === 1) acc.poor += 1;
          return acc;
        },
        { excellent: 0, veryGood: 0, good: 0, average: 0, poor: 0 }
      );
      setRatingsCount(counts);
    }
  }, [reviews]);


  const totalRatings = reviews?.length;
  const ratingDetails = [
    {
      label: "Excellent",
      color: "bg-green-500",
      count: ratingsCount.excellent,
    },
    { label: "Very Good", color: "bg-green-400", count: ratingsCount.veryGood },
    { label: "Good", color: "bg-yellow-500", count: ratingsCount.good },
    { label: "Average", color: "bg-yellow-600", count: ratingsCount.average },
    { label: "Poor", color: "bg-red-500", count: ratingsCount.poor },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Product Ratings
      </h2>
      <div className="flex items-center">
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
        <span className="text-gray-600 dark:text-gray-300 ml-2">
          {totalRatings} Ratings
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {ratingDetails.map((rating, index) => {
          const percentage = reviews?.length === 0 ? (0) : (rating.count / totalRatings) * 100;
          return (
            <li key={index} className="flex items-center justify-between">
              <span className="w-20 text-gray-700 dark:text-gray-300">
                {rating.label}
              </span>
              <div className="w-[15rem] flex-1 mx-4 bg-gray-300 dark:bg-gray-600 h-3 rounded-full">
                <div
                  className={`${rating.color} h-full rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 w-10">
                {rating.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductRatings;
