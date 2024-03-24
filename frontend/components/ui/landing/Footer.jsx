import React from 'react'

const Footer = () => {
    return (
        <div className='bg-[#101828]'>
            <div className="container mx-auto py-10">
                <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 text-white">
                    <div className="flex flex-col gap-4">
                        <img src="/assets/logoo.png" alt="" />
                        <p>Making learning fun and accessible to all.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className='text-gray-500 text-xl font-semibold'>Company</p>
                        <p className='text-lg  font-medium'>About Us</p>
                        <p className='text-lg  font-medium'>Career</p>
                        <div className="flex gap-1">
                            <p className='text-lg  font-medium'>Press</p>
                        </div>

                        <p className='text-lg  font-medium'>News</p>

                    </div>
                    <div className="flex flex-col gap-2">
                        <p className='text-gray-500 text-xl font-semibold'>Social</p>
                        <p className='text-lg  font-medium'>Facebook</p>
                        <p className='text-lg  font-medium'>Youtube</p>


                        <p className='text-lg  font-medium'>Twitter</p>
                        <p className='text-lg  font-medium'>Linkedin</p>

                    </div>
                    <div className="flex flex-col gap-2">
                        <p className='text-gray-500 text-xl font-semibold'>Legal</p>
                        <p className='text-lg  font-medium'>Terms</p>
                        <p className='text-lg  font-medium'>Privacy</p>


                        <p className='text-lg  font-medium'>Cookies</p>
                        <p className='text-lg  font-medium'>Contact</p>

                    </div>
                </div>
                <div className="flex justify-between items-center pt-20 pb-5">
                    <p className='text-gray-500'>© 2024 Collabrain. All rights reserved.</p>
                    <div className="flex gap-3">
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