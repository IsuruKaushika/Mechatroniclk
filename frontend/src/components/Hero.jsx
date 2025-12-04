import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets'; // adjust path if needed

const Hero = () => {
  const sliderImages = [
    assets.slide1,  // add your images here
    assets.slide2,
    assets.slide3,
    assets.slide4,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto rotate every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Manual controls
  const goPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % sliderImages.length
    );
  };

  return (
    <div className='relative w-full overflow-hidden h-[350px] sm:h-[400px] lg:h-[500px] bg-gray-50'>

      {/* Slider images */}
      {sliderImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="slide"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            index === currentImageIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        />
      ))}

      {/* Left Arrow */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {sliderImages.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 cursor-pointer rounded-full transition-all ${
              currentImageIndex === index
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
