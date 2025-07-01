import React from "react";
import Navbar from "../Components/Navbar";
import Header from "../Components/Header";
import Carousel from "../Components/Carousel/Carousel";
import Footer from "../Components/Footer/Footer";
import slide1 from "../assets/slide1.jpeg";
import slide2 from "../assets/slide2.jpeg";
import slide3 from "../assets/slide3.jpeg";
import ShopSections from "../Components/homepageCards";


function Homepage(){
    const slides = [
      {
        "src": slide1,
        "alt": "Image 1 for carousel"
        
      },
      {
        "src": slide2,
        "alt": "Image 2 for carousel"
      },
      
      {
        "src": slide3,
        "alt": "Image 1 for carousel"
      }
    ];
    return(
        <div >
        <Header />
        <Navbar />
        <Carousel data={slides} />
        <ShopSections/>
        <Footer />
        </div>
    );
}

export default Homepage;