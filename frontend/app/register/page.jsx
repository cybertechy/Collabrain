"use client";

const { isAuth, emailSignIn } = require("_firebase/auth");
const { useRouter } = require("next/navigation");
import Button from "../../components/ui/button";
import InputField from "../../components/ui/input/input";
import PasswordInput from "../../components/ui/input/passwordinput";
import EmailInputField from "../../components/ui/input/emailinput";
import { useEffect, useState } from 'react';
export default function Register() {
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
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center h-full">
                <img
                    className="w-28 "
                    src="./assets/images/logo_whitebackground.png"
                    alt="Logo"
                />
                <div className="bg-secondary drop-shadow-lg p-10 rounded-2xl mt-4">
                    <h1 className="text-2xl text-black font-poppins mb-6 text-center">
                      Create Your Collabrain Account
                    </h1>

                    <form onSubmit={emailSignIn} className="flex flex-col gap-4 max-w-md">
                        <div className="flex gap-4">
                            <InputField placeholder="First Name" color="tertiary"/>
                            <InputField placeholder="Last Name"  color="tertiary"/>
                        </div>
                        <div className="flex gap-4">
                            <InputField placeholder="Username"color="tertiary" />
                            <EmailInputField placeholder="Email Address" color = "tertiary" />
                        </div>
                        <div className="flex gap-4">
                            <PasswordInput placeholder="Password" color = "tertiary" />
                            <PasswordInput isConfirm={true} placeholder="Confirm Password" color = "tertiary" />
                        </div>
                        <p className="text-xs text-gray-600 text-left font-poppins ml-2">
                            Already have an account?<a href = "/" className="underline"> Log In</a>
                        </p>
                        <Button
                            text="Create"
                            color="primary"
                            onClick={() => {
                                router.push("/otp");
                            }}
                            className="mt-4"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
