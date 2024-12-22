import React, { useState, useEffect } from 'react';
import img1 from '../../assets/1.jpg';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';

const Carosal = () => {
  const slides = [
    img1,img2,img3,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically transition slides every 3 seconds slow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length]);

  return (
    <div className="bg-base-100 text-base-content flex justify-center mt-6">
      <div className="relative w-full max-w-4xl shadow-lg rounded-lg h-[250px] overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-[250px] object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <button
            className="btn btn-circle bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}
          >
            ❮
          </button>
          <button
            className="btn btn-circle bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
          >
            ❯
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'} transition duration-300`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carosal;
