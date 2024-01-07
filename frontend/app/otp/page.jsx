"use client";

const { isAuth } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require("next/navigation");
import Button from "../../components/ui/button";
import InputField from "../../components/ui/input/input";

export default function Register() {
    const router = useRouter();

    if (isAuth()) router.push("/dashboard"); // Redirect to dashboard

    return (
        <div>
            <div className="justify-center items-center flex flex-col">
                <img
                    className="w-28 fixed top-2"
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
                        <InputField placeholder="OTP" />
                        <br />

                        <Button
                            text="Confirm"
                            color="primary"
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                        />
                        <hr className="border-t-1 border-solid border-gray-400 mb-5"></hr>
                    </form>
                    <a className="font-poppins text-primary text-sm italic">
                        Resend OTP
                    </a>
                </div>
            </div>
        </div>
    );
}
