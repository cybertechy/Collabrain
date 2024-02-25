    "use client";

    const fb = require("_firebase/firebase");
    const { useRouter } = require("next/navigation");
    import Button from "../../components/ui/button/button";
    import InputField from "../../components/ui/input/input";
    import PasswordInput from "../../components/ui/input/passwordinput";
    import EmailInputField from "../../components/ui/input/emailinput";
    import UsernameInputField from "../../components/ui/input/usernameInput";
    const socket = require("_socket/socket");
    import { useEffect, useState } from 'react';
    import { ToastContainer, toast } from 'react-toastify'
    
    export default function Register() {
        const router = useRouter();
        const [backgroundLoaded, setBackgroundLoaded] = useState(false);
        const [user, loading]  = fb.useAuthState();
        const [email, setemail] = useState("");
        const [password, setpassword] = useState("");
        const [confirmPassword, setconfirmPassword] = useState("");
      
        const [firstname, setfirstname] = useState("");
        const [lastname, setlastname] = useState("");
    
        let sock_cli;
        const confirmPasswordSame= ()=>{
            if(password !=confirmPassword){
                toast.error("Password and Confirm Password are not the same")
                return false;
            }

        }
        useEffect(() =>
        {
            if (user){
                sock_cli = socket.init('http://localhost:8080');
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
            if (user) {
              router.push("/dashboard"); // Redirect to dashboard
            }
          }, [user, router]);
          
    
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
        
            if(!confirmPasswordSame()){
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
           
            
        }
        };
        return (
            <div className="max-sm:bg-primary max-sm:min-h-screen flex items-center justify-center min-h-screen">
                <ToastContainer />
                <div className="flex flex-col items-center justify-center">
                    <img
                        className="w-28 sm:hidden"
                        src="./assets/images/logo_whitebackground.png"
                        alt="Logo"
                    />
                    <div className="bg-primary drop-shadow-lg rounded-2xl mt-4 px-4 py-4 xsm:px-12 xsm:py-10">
                        <h1 className="text-2xl text-basicallylight font-poppins mb-6 text-center">
                            Create Your Collabrain Account
                        </h1>
    
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 p-4 items-center max-xxs:" style={{ textAlign: "center" }}>
                            <div className="flex max-xsm:pr-4 max-xsm:flex-col xsm:gap-4">
                            {/* max-xsm:gap-4 flex-col max-xsm:justify-center max-xsm:items-center max-xsm:space-x-4"> */}
                            <InputField name = "firstname" value = {firstname} input={firstname} setinput={setfirstname} placeholder="First Name" color="primary"/>
                            <InputField name="lastname" value = {firstname} input={lastname} setinput={setlastname} placeholder="Last Name"  color="primary"/>
                            </div>
                            <div className="flex xsm:w-full max-xsm:pr-4 items-center">
                                
                                <EmailInputField name="email" value = {email}email={email} setEmail={setemail} placeholder="Email Address" color = "primary" />
                            </div>
                            <div className="flex max-xsm:pr-4 max-xsm:flex-col xsm:gap-4">
                            <PasswordInput name="password" value = {password} password={password} setPassword={setpassword} placeholder="Password" color = "primary" />
                            <PasswordInput password={confirmPassword} setPassword={setconfirmPassword} isConfirm={true} placeholder="Confirm Password" color = "primary" />
                            </div>
                            <p className="text-xs text-basicallylight text-left font-poppins ml-2">
                                Already have an account?
                                <a href="/" className="underline">
                                    {" "}
                                    Log In
                                </a>
                            </p>
                            <Button
                                text="Create Account"
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