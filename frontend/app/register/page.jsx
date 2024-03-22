    "use client";

    const fb = require("_firebase/firebase");
    const { useRouter } = require("next/navigation");
    import Button from "../../components/ui/button/button";
    import InputField from "../../components/ui/input/input";
    import PasswordInput from "../../components/ui/input/passwordinput2";
    import EmailInputField from "../../components/ui/input/emailinput2";
    const socket = require("_socket/socket");
    import { useEffect, useState } from 'react';
    import { ToastContainer, toast } from 'react-toastify'
    import { hasUsername } from "../utils/user";
    import "../utils/i18n"
    import { useTranslation } from 'react-i18next';
    const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
    export default function Register() {
        const router = useRouter();
        const [backgroundLoaded, setBackgroundLoaded] = useState(false);
        const [user, loading]  = fb.useAuthState();
        const [email, setemail] = useState("");
        const [password, setpassword] = useState("");
        const [confirmPassword, setconfirmPassword] = useState("");
        const [isError, setIsError] = useState(false);
        const [firstname, setfirstname] = useState("");
        const [lastname, setlastname] = useState("");
        const { t } = useTranslation('login_signup');
    
        let sock_cli;
       
        const confirmPasswordSame = () => {
            if (password !== confirmPassword) {
                setIsError(true); // Set isError to true when passwords don't match
                toast.error(t('pass_mismatch'));
                return false;
            } else {
                setIsError(false); // Set isError to false when passwords match
                return true;
            }
        };
        const onConfirmPasswordInputChange = () => {
            if (password !== confirmPassword) {
                setIsError(true); // Set isError to true when passwords don't match
               
                return false;
            } else {
                setIsError(false); // Set isError to false when passwords match
                return true;
            }
        };
        useEffect(() =>
        {
           onConfirmPasswordInputChange();
        }, [confirmPassword]);
        useEffect(() =>
        {
            if (user){
                sock_cli = socket.init(SERVERLOCATION) || {};
            console.log(sock_cli)
            }
        }, [user]);

        useEffect(() => {
            // Preload the background image
            const img = new Image();
            img.src = '/assets/images/background.jpg'; // Adjust the path to your background image
            img.onload = () => {
                setBackgroundLoaded(true);
                document.body.classList.add('custom-background');
            };
    
            // Remove the custom background class when the component unmounts
            return () =>
            {
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
                        console.log("userHasUsername is ",userHasUsername);
                        console.log("User does not have a username");
                        router.push("/username"); // Redirect to username page if user does not have username
                       
                    }
                }
            };
        
            checkUserUsername();
        }, [user]);
        
    
        if (!backgroundLoaded)
        {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="loader"></div>
                </div>
            );
        }

        
     
    
    
        const handleFormSubmit = async (e) => {
            e.preventDefault();
        
            if (!confirmPasswordSame()) {
                // Passwords don't match, return early
                return;
            }
        
            // Create a custom event object that mimics the structure of a real event
            const customEvent = {
                preventDefault: () => {}, //dummy function for preventDefault
                target: {
                    elements: {
                        email: { value: email },
                        password: { value: password },
                        firstname: { value: firstname },
                        lastname: { value: lastname },   
                    }
                }
            };
        
            await fb.emailSignUp(customEvent);
        };
        
        return (
            <div className=" max-sm:min-h-screen flex items-center justify-center min-h-screen">
                <ToastContainer />
                <div className="flex flex-col items-center justify-center">
                    <img
                        className="w-40"
                        src="./assets/images/logo_whitebackground.png"
                        alt="Logo"
                    />
                    <div className="bg-basicallylight drop-shadow-lg sm:p-10 rounded-2xl sm:mt-4 items-center justify-center">
                        <h1 className="text-2xl text-primary font-sans mb-6 text-center">
                            {t('reg_top')}
                        </h1>
    
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 max-w-md">
                            <div className="flex max-sm:flex-col sm:gap-4 items-center justify-center">
                            <InputField name = "firstname" value = {firstname} input={firstname} setInput={setfirstname} placeholder={t('fname')} color="primary"/>
                            <InputField name="lastname" value = {firstname} input={lastname} setInput={setlastname} placeholder={t('lname')}  color="primary"/>
                            </div>
                            <div className="flex w-full max-sm:pr-4 items-center justify-center">
                                <EmailInputField name="email" value = {email} email={email} setEmail={setemail} placeholder={t('email')} color = "primary" />
                            </div>
                            <div className="flex max-sm:pr-4 max-sm:flex-col sm:gap-4 items-center justify-center">
                            <PasswordInput name="password" value = {password} password={password} setPassword={setpassword} placeholder={t('password')} color = "primary" />
                           </div>
                           <div className="flex w-full max-sm:pr-4 items-center justify-center">
                           <PasswordInput  password={confirmPassword} setPassword={setconfirmPassword} isConfirm={true} placeholder={t('confirm_pass')} color = "primary" isError = {isError}/>
                           </div>
                            <p className="text-xs text-primary text-left font-sans font-extralight ml-2">
                                {t('have_acc_q')}
                                <a href="/" className="underline">
                                    {" "}
                                    {t('login_button')}
                                </a>
                            </p>
                            <Button
                                text={t('create_acc')}
                                color="primary"
                                type = "submit"
                                className="mt-4"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }