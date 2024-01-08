"use client";

const { isAuth, emailSignIn } = require("_firebase/auth");
const { useRouter } = require("next/navigation");
import Button from "../../components/ui/button";
import InputField from "../../components/ui/input/input";
import PasswordInput from "../../components/ui/input/passwordinput";
import EmailInputField from "../../components/ui/input/emailinput";

export default function Register() {
    const router = useRouter();

    if (isAuth()) router.push("/dashboard");

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
                            <InputField placeholder="First Name" />
                            <InputField placeholder="Last Name" />
                        </div>
                        <div className="flex gap-4">
                            <InputField placeholder="Username" />
                            <EmailInputField placeholder="Email Address" />
                        </div>
                        <div className="flex gap-4">
                            <PasswordInput placeholder="Password" />
                            <PasswordInput isConfirm={true} placeholder="Confirm Password" />
                        </div>

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
