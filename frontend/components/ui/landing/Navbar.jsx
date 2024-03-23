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
    <div className='mx-auto  '>
        
        <div className="container flex flex-col lg:flex-row py-2 justify-between items-center overflow-x-hidden">
            
            <Image src={logo}
            alt="logo" 
            height={90} 
            width={130} />
            
           
            <div className="flex items-center gap-4">
                <p className='text-base font-medium cursor-pointer'>Contact Us</p>
             
                {!user && <p onClick={()=>router.push("/register")} className='text-base font-medium cursor-pointer'>Sign Up</p>}
                {!user && <p onClick={()=>router.push("/login")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold border border-none cursor-pointer btn btn-sm'>Log In</p>}
                {user && <p onClick={()=>router.push("/dashboard")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold border border-none cursor-pointer btn btn-sm'>Dashboard</p>}
            </div>
        </div>
    </div>
  )
}

export default Navbar