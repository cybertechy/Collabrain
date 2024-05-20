"use client";
import React from 'react'
import logo from '@/public/assets/images/logo_whitebackground.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation' 
const fb = require("_firebase/firebase");

const Navbar = () => {
  const router = useRouter()
  const [user, loading] = fb.useAuthState();
  
  return (
    <div className='flex mx-36'> {/* Changed from flex-col to flex for horizontal layout */}
        
        <div className=" flex flex-col lg:flex-row py-2 justify-between items-center w-full">
            
            <Image src={logo}
            className="sm:h-40 sm:w-40 h-40 w-40"
            alt="logo" 
            height={90} 
            width={130} />
            
            <div className="flex items-center gap-4">
                <p className='text-base font-medium cursor-pointer' onClick={() => router.push("/contact")}>Contact Us</p>
                
                {!user && <p onClick={() => router.push("/register")} className='text-base font-medium cursor-pointer'>Sign Up</p>}
                {!user && <p onClick={() => router.push("/login")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Log In</p>}
                {user && <p onClick={() => router.push("/dashboard")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Dashboard</p>}
            </div>
        </div>
    </div>
  );
}

export default Navbar