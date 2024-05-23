"use client";
import React from 'react'
import { useRouter } from 'next/navigation' 
import logo from '@/public/assets/images/logo_whitebackground.png'
import Image from 'next/image'
import ErrorJSON from "@/public/assets/json/Error.json";
import dynamic from 'next/dynamic'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const Error500 = () => {
    const router = useRouter()
  return (
  
  <div className='w-screen h-screen' >
    <div className='flex lg:mx-28 lg:mr-44'> {/* Changed from flex-col to flex for horizontal layout */}
        <div className=" flex flex-col lg:flex-row py-2 justify-between items-center w-full">
            
        <div className="relative h-28 w-40 sm:h-40 sm:w-56"> {/* Container to control size */}
              <Image src={logo}
                layout="fill" // Makes the image fill the container
                objectFit="contain" // Keeps the aspect ratio, prevents stretching
                alt="logo" 
                onClick={() => router.push("/")}
              />
            </div>
            
            <div className="flex items-center gap-4">
                <p className='text-base font-medium cursor-pointer' onClick={() => router.push("/contact")}>Contact Us</p>
                <p onClick={() => router.push("/")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Home</p>
                
                
            </div>
        </div>
    </div>
    <div className='flex flex-col justify-center items-center h-fit mt-[20%] md:mt-[25%] lg:mt-[5%] px-4'>
    <Lottie animationData={ErrorJSON} style={{ width: 300, height: 300 }} />
      <h1 className='text-primary text-3xl text-center'>500 - Server-side error occurred</h1>
    </div>
    </div>
  )
}

export default Error500