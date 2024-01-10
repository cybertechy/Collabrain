"use client";

const { isAuth } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
import Button from "../../components/ui/button";
import InputField from "../../components/ui/input/input";
import { useEffect, useState } from 'react';
export default function OTP() {
    const router = useRouter();
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);

    useEffect(() => {
        // Preload the background image
        const img = new Image();
        img.src = '/assets/images/background.jpg'; // Adjust the path to your background image
        img.onload = () => {
            setBackgroundLoaded(true);
            document.body.classList.add('custom-background');
        };

        // Remove the custom background class when the component unmounts
        return () => {
            document.body.classList.remove('custom-background');
        };
    }, []);
    if (isAuth()) {
        router.push("/dashboard"); // Redirect to dashboard
        return null; // Prevents rendering the rest of the component
    }
    if (!backgroundLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }
    return (
        <div>
            <div className="justify-center items-center flex flex-col">
                <img
                    className="w-28 "
                    src=".//assets/images/logo_whitebackground.png"
                />
                <div className="bg-secondary drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
                    <p className=" text-black font-poppins mb-2 ">
                        You have received an OTP in your email address!
                    </p>
                    <br />
                    <p className=" text-black font-poppins mb-2 italic">
                        Enter it in the input below!
                    </p>
                    <form onSubmit={() => {}} style={{ textAlign: "center" }}>
                        <InputField placeholder="OTP" color = "tertiary"/>
                        <br />
                       <p className="text-left ml-2 font-poppins text-gray-600 text-xs italic">
                        Didn't recieve a code? <a className="underline">Resend OTP
                    </a></p> 

                        <Button
                            text="Confirm"
                            color="primary"
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                        />
                        
                        <hr className="border-t-1 border-solid border-gray-400 mb-5"></hr>
                    </form>
                    <p className="text-xs text-gray-600 text-left font-poppins ml-2">
                        Already have an account?
                        <a href="/" className="underline">
                            {" "}
                            Log In
                        </a>
                    </p>
                  
                </div>
            </div>
        </div>
    );
}
