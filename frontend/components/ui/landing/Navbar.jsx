"use client";
import React,{useEffect, useState} from 'react'
import logo from '@/public/assets/images/logo_whitebackground.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation' 
const fb = require("_firebase/firebase");
import { ToastContainer, toast } from 'react-toastify';

const ServerLocation = process.env.NEXT_PUBLIC_SERVER_LOCATION

const Navbar = () => {
  const router = useRouter()
  const [user, loading] = fb.useAuthState();
  const [Functional, setFunctional] = useState(false)

  async function CheckServerStatus(){
    try{
      fetch(ServerLocation+'/api/home').then((response) => {
        if(response.status === 200){
          setFunctional(true);
          return true;
        } else return false;
      })
    } catch (error) {
      console.log("Server Down: ",error)
      return false;
    }
  }

  const Downtime = () => {

    CheckServerStatus();

    toast.error('Server is Down, Please try again later', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  }

  useEffect(() => {
    if(user) CheckServerStatus();
  }, [user])

  return (
    <div className='flex lg:mx-28 lg:mr-44'> {/* Changed from flex-col to flex for horizontal layout */}
        <ToastContainer />
        <div className=" flex flex-col lg:flex-row py-2 justify-between items-center w-full">
            
        <div className="relative h-28 w-40 sm:h-40 sm:w-56"> {/* Container to control size */}
              <Image src={logo}
                layout="fill" // Makes the image fill the container
                objectFit="contain" // Keeps the aspect ratio, prevents stretching
                alt="logo" 
              />
            </div>
            
            <div className="flex items-center gap-4">
                <p className='text-base font-medium cursor-pointer' onClick={() => router.push("/contact")}>Contact Us</p>
                
                {!user && <p onClick={() => router.push("/register")} className='text-base font-medium cursor-pointer'>Sign Up</p>}
                {!user && <p onClick={() => router.push("/login")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Log In</p>}
                {user && Functional && <p onClick={() => router.push("/dashboard")} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Dashboard</p>}
                {user && !Functional && <p onClick={Downtime} className='text-base capitalize text-white bg-primary py-2 px-4 rounded-lg font-semibold cursor-pointer'>Dashboard</p>}
            </div>
        </div>
    </div>
  );
}

export default Navbar