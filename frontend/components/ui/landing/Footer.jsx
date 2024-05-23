import React from 'react'

const Footer = () => {
    return (
        <div className='bg-[#101828]'>
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 text-white">
                <div className="flex flex-col gap-4 items-center text-center">
                    <img src="/assets/logoo.png" alt="" />
                    <p>Making learning fun and accessible to all.</p>
                </div>

                <div className="flex flex-col gap-2 items-center text-center">
                    <p className='text-gray-500 text-xl font-semibold'>Company</p>
                    <a href="https://collabrain-status.cybertech13.eu.org/" className='text-lg font-medium'>System status</a>
                    <p className='text-lg font-medium'>About Us</p>
                    <p className='text-lg font-medium'>Career</p>
                    <p className='text-lg font-medium'>Press</p>
                    <p className='text-lg font-medium'>News</p>
                </div>

                <div className="flex flex-col gap-2 items-center text-center">
                    <p className='text-gray-500 text-xl font-semibold'>Social</p>
                    <p className='text-lg font-medium'>Facebook</p>
                    <p className='text-lg font-medium'>Youtube</p>
                    <p className='text-lg font-medium'>Twitter</p>
                    <p className='text-lg font-medium'>Linkedin</p>
                </div>

                <div className="flex flex-col gap-2 items-center text-center">
                    <p className='text-gray-500 text-xl font-semibold'>Legal</p>
                    <p className='text-lg font-medium'>Terms</p>
                    <p className='text-lg font-medium'>Privacy</p>
                    <p className='text-lg font-medium'>Cookies</p>
                    <p className='text-lg font-medium'>Contact</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center pt-20 pb-5 text-center">
                <p className='text-gray-500 w-full lg:w-auto'>© 2024 Collabrain. All rights reserved.</p>
                <div className="flex gap-3 justify-center mt-4 lg:mt-0">
                    {/* Social icons can be uncommented and used here */}
                    {/* <BsFacebook className='text-gray-500 hover:text-primary' />
                    <BsInstagram className='text-gray-500 hover:text-primary' />
                    <BsTwitter className='text-gray-500 hover:text-primary' /> */}
                </div>
            </div>
        </div>
    </div>
    )
}

export default Footer