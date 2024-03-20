"use client";

const fb = require("_firebase/firebase"); // Import the authentication functions
const { useRouter } = require("next/navigation");
import Button from "../components/ui/button/button";
import GoogleIcon from "../public/assets/svg/socials/google.svg";
import MicrosoftIcon from "../public/assets/svg/socials/microsoft.svg";
import AppleIcon from "../public/assets/svg/socials/apple.svg";
import PasswordInput from "../components/ui/input/passwordinput2";
import EmailInputField from "../components/ui/input/emailinput";
import EmailInput from "../components/ui/input/emailinput2";
import GitHubIcon from '@mui/icons-material/GitHub';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { hasUsername } from "./utils/user";
import axios from 'axios';
import Link from 'next/link';
export default function Home() {
    const [user, loading] = fb.useAuthState();
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


    useEffect(() => {
        const checkUserUsername = async () => {
            if (user) {
                const userHasUsername = await hasUsername();
                if (userHasUsername) {
                    console.log("User has username", userHasUsername);
                    router.push("/dashboard"); // Redirect to dashboard if user has username
                } else {
                    console.log("userHasUsername is ", userHasUsername);
                    console.log("User does not have a username");
                    router.push("/username"); // Redirect to username page if user does not have username
                    // setUsernameChecked(true); // Set state to indicate username check is completed
                    // Now you can render a message or enable registration for username
                }
            }
        };

        checkUserUsername();
    }, [user]);
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
            preventDefault: () => { }, //dummy function for preventDefault
            target: {
                elements: {
                    email: { value: email },
                    password: { value: password },


                }
            }
        };
        let res = await fb.emailSignIn(customEvent);
        if (res?.error) {
            toast.error(res.error,{
                theme: "colored",
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
 
        // Check if user is enrolled in 2FA and redirect to OTP verification page
        const token = await fb.getToken();
        const twoFAStatus = await axios.get('http://localhost:8080/api/2FA/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (twoFAStatus.data.twoFA) {
          router.push('/2fa'); // Redirect to OTP verification page
          
        }
      };

    
    return (
        <div className="max-sm:min-w-full md:w-3/4 lg:w-1/2 mx-auto max-w-md">
            <ToastContainer />
            <div className="justify-center items-center flex flex-col min-h-screen">
                <img
                    className="w-40"
                    src=".//assets/images/logo_whitebackground.png"
                />
                <div className="bg-basicallylight drop-shadow-lg flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
                    <h1 className="text-2xl text-primary font-sans font-bold mb-2">
                        Log into Collabrain
                    </h1>
                    <p className="whitespace-normal break-words text-xs font-sans text-center font-thin">
                        You are now one step away from accessing the world of collaboration and productivity.

                    </p>


                    <br />
                    <form
                        onSubmit={handleFormSubmit}
                        style={{ textAlign: "center" }}
                    >
                        <EmailInput email={email} setEmail={setemail} placeholder="Email ID" />
                        <br />
                        <PasswordInput placeholder="Password" password={password} setPassword={setpassword} />
                        <p className="text-sm text-primary font-sans font-light text-left mt-2">
                            <Link href="/forgotPassword">Forgot your password?</Link>
                        </p>
                        <Button
                            text="Log In"
                            color="primary"
                            type="submit"
                        />
                        <div className="line-with-text">
                            <span className="linesep"></span>
                            <span className="textsep font-bold">OR</span>
                            <span className="linesep"></span>
                        </div>
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
                    <p className="text-xs text-primary font-sans font-light text-left ml-2">
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
