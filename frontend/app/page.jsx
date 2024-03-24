import React from "react";
import Footer from "@/components/ui/landing/Footer";
import Hero from "@/components/ui/landing/Hero";
import NavBar from "@/components/ui/landing/Navbar";
import PopularClass from "@/components/ui/landing/PopularClass";
import Testimonials from "@/components/ui/landing/Testimonials";

const page = () => {
  return <>
      <NavBar/>
      <Hero/>
      <PopularClass/>
      <Testimonials/>
      <Footer/>
  </>;
};

export default page;
