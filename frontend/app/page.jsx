"use client"

const { isAuth, emailSignIn, serviceSignIn } = require("_firebase/auth"); // Import the authentication functions
const { useRouter } = require('next/navigation');
import Button from '../components/ui/button';
import InputField from '../components/ui/input';
import GoogleIcon from '../public/assets/svg/google.svg';
import MicrosoftIcon from '../public/assets/svg/microsoft.svg';
import TwitterIcon from '../public/assets/svg/twitterx.svg';
import FacebookIcon from '../public/assets/svg/facebook.svg';

export default function Home()
{
	const router = useRouter();

	if (isAuth())
		router.push('/dashboard'); // Redirect to dashboard

	return (
		<div>
		<div className = "justify-center items-center flex flex-col">
		<img className = "w-28 fixed top-2"src='.//assets/images/logo_whitebackground.png'/>
		<div className="bg-secondary flex flex-col justify-center items-center px-16 py-10 rounded-2xl">
			<h1 className="text-2xl text-black font-poppins mb-2">Log into Collabrain</h1>


			{/* The following code is just an example to show what functions to call for authentication
				it would be probably better to implement the UI with a library of prebuilt components */}

			<br />
			<form onSubmit={emailSignIn} style={{ textAlign: "center" }}>
        <InputField placeholder="Email Address" />
        <br />
        <InputField placeholder="Password" />
        <br />
		<p className="text-xs text-gray-600 font-poppins text-left"><a>Forgot your password?</a></p>
        <Button text="Log In" color= "primary" onClick={emailSignIn} />
		<hr className="border-t-1 border-solid border-gray-400"></hr>
      </form>
	 
	  <span className= "">
		<button onClick={() => serviceSignIn("google")} className="bg-white py-1 px-1 rounded-full m-5"><GoogleIcon className="h-8 w-8 text-gray-500"></GoogleIcon></button> 
  <button className="bg-white py-1 px-1 rounded-full m-5"><FacebookIcon className="h-8 w-8 text-gray-500"></FacebookIcon></button>
  <button onClick={() => serviceSignIn("microsoft")} className="bg-white py-1 px-1 rounded-full m-5"><MicrosoftIcon className="h-8 w-8 text-gray-500"></MicrosoftIcon></button>
  <button className="bg-white py-1 px-1 rounded-full m-5"><TwitterIcon className="h-8 w-8 text-gray-500"></TwitterIcon></button>
  </span>
		</div>

		
		</div>
		<div className="bg-secondary flex flex-col justify-center items-center px-16 py-10 rounded-2xl mt-5">
			<h1 className="text-2xl text-black font-poppins mb-2">Don't Have An Account?</h1>


			
        <Button text="Register" color= "teritary" onClick={()=>{router.push('/register');}} />
	
		</div>

		</div>
	)
}
