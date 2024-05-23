import React from 'react'
import Image from 'next/image'
import logo from '@/public/assets/images/logo_whitebackground.png'

const Testimonials = () => {
  return (
    <div className='container mx-auto flex flex-col justify-center items-center bg-gray-50 py-10 px-4 '>
        <Image className='' src={logo} alt="collabrain logo" />
        <p className='text-3xl font-semibold text-center'><br />Revolutionize Education: Partner with Collabrain!</p>
        <p className='text-1xl text-center '><br />Collabrain is currently used by over 400 universities and educational institutes worldwide. <br />
        Contact us and become a part of the digital learning wave 🏄🏻‍♂️<br/></p>
        <br/>
        <button className="btn bg-primary text-white p-2 rounded-lg border-none capitalize btn-md">
              Contact Us
        </button>
    </div>
  )
}

export default Testimonials