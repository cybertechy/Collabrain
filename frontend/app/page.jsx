
"use client";

const fb = require("_firebase/firebase"); // Import the authentication functions
const { useRouter } = require("next/navigation");
import Button from "../components/ui/button/button";
import GoogleIcon from "../public/assets/svg/socials/google.svg";
import MicrosoftIcon from "../public/assets/svg/socials/microsoft.svg";
import AppleIcon from "../public/assets/svg/socials/apple.svg";
import PasswordInput from "../components/ui/input/passwordinput";
import EmailInputField from "../components/ui/input/emailinput";
import GitHubIcon from '@mui/icons-material/GitHub';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
export default function Home() {
    const [user, loading]  = fb.useAuthState();
    const router = useRouter();
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

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
    if (user) {
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
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        // Create a custom event object that mimics the structure of a real event
        const customEvent = {
            preventDefault: () => {}, //dummy function for preventDefault
            target: {
                elements: {
                    email: { value: email },
                    password: { value: password },
                    
                    
                }
            }
        };
       await fb.emailSignIn(customEvent);
       
        
    };
    return (
        <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
            <ToastContainer />
            <div className="justify-center items-center flex flex-col min-h-screen">
                <img
                    className="w-28 "
                    src=".//assets/images/logo_whitebackground.png"
                />
                <div className="bg-primary drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
                    <h1 className="text-2xl text-basicallylight font-poppins mb-2">
                        Log into Collabrain
                    </h1>

                    {/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

                    <br />
                    <form
                       onSubmit={handleFormSubmit}
                        style={{ textAlign: "center" }}
                    >
                        <EmailInputField email={email} setEmail={setemail} placeholder="Email Address" color="primary" />
                        <br />
                        <PasswordInput password={password} setPassword={setpassword} color="primary" />
                     
                        <br />
                        <p className="text-xs text-basicallylight font-poppins text-left ml-2">
                            <a href="">Forgot your password?</a>
                        </p>
                        <Button
                            text="Log In"
                            color="primary"
                            type = "submit"
                        />
                        <hr className="border-t-1 border-solid border-gray-400"></hr>
                    </form>

                    <span className="items-center justify-center flex flex-row">
                        <button
                            onClick={() => fb.serviceSignIn("google")}
                            className="bg-basicallylight py-1 px-1 rounded-full m-5"
                        >
                            <GoogleIcon className="h-8 w-8 "></GoogleIcon>
                        </button>
                        <button
                            onClick={() => fb.serviceSignIn("microsoft")}
                            className="bg-basicallylight py-1 px-1 rounded-full m-5"
                        >
                            <MicrosoftIcon className="h-8 w-8"></MicrosoftIcon>
                        </button>
                      
                    </span>
                    <p className="text-xs text-basicallylight font-poppins text-left ml-2">
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
