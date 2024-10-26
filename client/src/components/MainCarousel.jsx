import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

function MainCarousel({banners}) {
  const items = banners.map((banner, index)=> (
    <div key={index} className="relative h-96 overflow-hidden">
      <img
        src={banner.imageUrl}
        alt="Banner"
        className="object-cover object-center m-auto"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl">{banners.title}</h1>
      </div>
    </div>
  ))

  return (
    <div className="h-96 mx-auto overflow-hidden rounded object-cover object-center">
      <AliceCarousel
        animationDuration={800}
        disableButtonsControls
        disableDotsControls
        infinite
        autoPlay // Enable auto play
        autoPlayInterval={3000} // Change to your preferred interval in milliseconds
        touchTracking
        mouseTracking // Enable mouse tracking for changing images
        items={items}
        animationType="fadeleft"
      />
    </div>
  );
}

export default MainCarousel;
