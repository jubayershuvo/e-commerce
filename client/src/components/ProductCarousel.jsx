import React, { useState, useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import ProductCard from "../pages/customer/ProductCard";

function ProductCarousel({ items }) {
  items = items.map((product, index) => (
    <div
      key={index}
      className={`relative max-w-96 m-4 hover:scale-105 hover:shadow-xl transform transition-transform duration-300`}
    >
      <ProductCard product={product} />
    </div>
  ))
  const carouselRef = useRef(null); // Reference to AliceCarousel
  const [activeIndex, setActiveIndex] = useState(0); // Track active slide index

  const responsive = {
    0: { items: 1 },
    720: { items: 3 },
    1080: { items: 5 },
  };

  // Handle slide to the previous item using the AliceCarousel method
  const slidePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.slidePrev();
      setActiveIndex((prevIndex) => prevIndex - 1); // Update active index
    }
  };

  // Handle slide to the next item using the AliceCarousel method
  const slideNext = () => {
    if (carouselRef.current) {
      carouselRef.current.slideNext();
      setActiveIndex((prevIndex) => prevIndex + 1); // Update active index
    }
  };

  // Hide left arrow on first slide, right arrow on last slide
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === items?.length - 1;

  return (
    <div className="relative overflow-hidden">
      {items && items?.length > 0 && (
        <div className="mx-4">
          <AliceCarousel
            ref={carouselRef} // Set the reference to the carousel
            animationDuration={800}
            disableButtonsControls
            disableDotsControls
            touchTracking
            mouseTracking
            items={items}
            responsive={responsive}
            activeIndex={activeIndex}
            onSlideChanged={(e) => setActiveIndex(e.item)} // Sync index on manual scroll
          />
        </div>
      )}

      {/* Left Arrow Button (Hidden on first slide) */}
      {!isFirstSlide && (
        <button
          onClick={slidePrev}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 ml-2"
        >
          <ArrowLeftIcon />
        </button>
      )}

      {/* Right Arrow Button (Hidden on last slide) */}
      {!isLastSlide && (
        <button
          onClick={slideNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-full mr-2"
        >
          <ArrowRightIcon width={"1.5rem"} />
        </button>
      )}
    </div>
  );
}

export default ProductCarousel;
