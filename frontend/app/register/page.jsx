"use client"

const { isAuth, emailSignIn } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require('next/navigation');
import Button from '../../components/ui/button';
import InputField from '../../components/ui/input';


export default function Register()
{
	const router = useRouter();

	if (isAuth())
		router.push('/dashboard'); // Redirect to dashboard

	return (
		<div>
		<div className = "justify-center items-center flex flex-col">
		<img className = "w-28 fixed top-2" src='.//assets/images/logo_whitebackground.png'/>
		<div className="bg-secondary flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
			<h1 className="text-2xl text-black font-poppins mb-2">Create Your Collabrain Account</h1>



			<br />
			<form onSubmit={emailSignIn} style={{ textAlign: "center" }}>
        <InputField placeholder="First Name" />
        <br />
        <InputField placeholder="Last Name" />
        <br />
        <InputField placeholder="Email Address" />
        <br />
        <InputField placeholder="Username" />
        <br />
        <InputField placeholder="Password" />
        <br />
        <InputField placeholder="Confirm Password" />
        <br />
	
        <Button text="Create" color= "primary" onClick={()=>{router.push('/otp');}} />
      </form>
	 
	 
		</div>

		
		</div>

		</div>
	)
}
