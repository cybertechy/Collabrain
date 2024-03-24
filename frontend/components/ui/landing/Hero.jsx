import React from "react";
import Image from "next/image";
import PublicSvg from "@/public/assets/svg/public.svg";
import ThinkSvg from "@/public/assets/svg/think.svg";
import landingImg from "@/public/assets/images/LandingHome.png";

const Hero = () => {
  return (
    <div className="container mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-center py-10 gap-5">
        <div className="flex flex-col gap-4">
          <p className="text-7xl capitalize font-semibold">
            Your New 
            <br />
            <span className="text-primary pl-2 capitalize">Learning</span>{" "}
             {" "}
             <br />
            Companion
          </p>
          <p className="text-lg text-gray-600">
           Collabrain, an innovative brainstorming platform for students and professionals.
            <br />
            Join now and become a part of a thriving community keen on seeking knowledge!
          </p>
          
          <div className="flex gap-6 items-center pt-6">
            <div className="flex gap-2 items-center">
                <PublicSvg />
                <p>90,000+ Active Users</p>
            </div>
           
            <div className="flex gap-2 items-center">
                <ThinkSvg />
                <p>Used by 400+ institutes worldwide</p>
            </div>
          </div>
        </div>

        <Image src={landingImg} alt="landing" className="w-1/2 h-1/2" />
      </div>
    </div>
  );
};

export default Hero;
