
"use client";

const { isAuth, emailSignIn, serviceSignIn } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
import Button from "../components/ui/button/button";
import GoogleIcon from "../public/assets/svg/socials/google.svg";
import MicrosoftIcon from "../public/assets/svg/socials/microsoft.svg";
import AppleIcon from "../public/assets/svg/socials/apple.svg";
import PasswordInput from "../components/ui/input/passwordinput";
import EmailInputField from "../components/ui/input/emailinput";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
export default function Home() {
    const router = useRouter();
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);

    // Data States
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    

    useEffect(() => {
        // Preload the background image
        const img = new Image();
        img.src = "/assets/images/background.jpg"; // Adjust the path to your background image
        img.onload = () => {
            setBackgroundLoaded(true);
            document.body.classList.add("custom-background");
        };

        // Remove the custom background class when the component unmounts
        return () => {
            document.body.classList.remove("custom-background");
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

    const formSignin =  async (event) => {
        event.preventDefault();
        let result = await emailSignIn(email, password);
        if(!result.success) {
            toast.error(result.error,{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored",
            });
        } else {
            router.push("/dashboard");
        }
    };


    return (
        <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
            <ToastContainer />
            <div className="justify-center items-center flex flex-col min-h-screen">
                <img
                    className="w-28 "
                    src=".//assets/images/logo_whitebackground.png"
                />
                <div className="bg-secondary drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
                    <h1 className="text-2xl text-black font-poppins mb-2">
                        Log into Collabrain
                    </h1>

                    {/* The following code is just an example to show what functions to call for authentication
                    {/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

                    <br />
                    <form
                        onSubmit={formSignin}
                        style={{ textAlign: "center" }}
                    >
                        <EmailInputField email={email} setEmail={setemail} placeholder="Email Address" color="tertiary" />
                        <br />
                        <PasswordInput password={password} setPassword={setpassword} color="tertiary" />
                     
                        <br />
                        <p className="text-xs text-gray-600 font-poppins text-left ml-2">
                            <a href="">Forgot your password?</a>
                        </p>
                        <Button
                            text="Log In"
                            color="primary"
                            onClick={emailSignIn}
                        />
                        <hr className="border-t-1 border-solid border-gray-400"></hr>
                    </form>

                    <span className="">
                        <button
                            onClick={() => serviceSignIn("google")}
                            className="bg-white py-1 px-1 rounded-full m-5"
                        >
                            <GoogleIcon className="h-8 w-8 text-gray-500"></GoogleIcon>
                        </button>
                        <button
                            onClick={() => serviceSignIn("microsoft")}
                            className="bg-white py-1 px-1 rounded-full m-5"
                        >
                            <MicrosoftIcon className="h-8 w-8 text-gray-500"></MicrosoftIcon>
                        </button>
                        <button className="bg-white py-1 px-1 rounded-full m-5">
                            <AppleIcon className="h-8 w-8 text-gray-500"></AppleIcon>
                        </button>
                    </span>
                    <p className="text-xs text-gray-600 font-poppins text-left ml-2">
                        Need an account?
                        <a href="/register" className="underline">
                            {" "}
                            SIGN UP
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
