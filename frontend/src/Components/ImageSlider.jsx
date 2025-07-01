import React, { useState } from 'react';

const ImageSlider = ({ 
  images, 
  className = "", 
  width = "100%",
  height = "400px"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div>No images provided</div>;
  }

  const handlePrevious = () => {
    setCurrentIndex(current => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(current => 
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  const sliderStyle = {
    width: width,
    maxWidth: '100%'
  };

  const mainImageStyle = {
    height: height
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`} style={sliderStyle}>
      {/* Main Image Container */}
      <div className="relative w-full" style={mainImageStyle}>
        <img 
          src={images[currentIndex]} 
          alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-transparent text-xl font-bold w-10 h-10 border-none"
              aria-label="Previous image"
            >
              &#10094;
            </button>
            
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-transparent text-xl font-bold w-10 h-10 border-none"
              aria-label="Next image"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      {/* Line Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 w-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`h-1 rounded-full transition-all border-none duration-300 cursor-pointer ${
                currentIndex === index 
                  ? 'w-8 bg-[#C8A055]' 
                  : 'w-4 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;