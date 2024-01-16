"use client";

import { useState, useEffect } from "react";

const { isAuth, getToken } = require("_firebase/auth"); // Import the authentication functions

export default function Home()
{
	const [token, setToken] = useState(null); // Create a state for the token

	if (!isAuth()) // If the user is authenticated
	{
		return (
			<div className="flex flex-col justify-center items-center">
				<h1>You're not signed in</h1>
			</div>
		);
	}

	getToken().then((t) => setToken(t)); // Get the token using

	return (
		<div className="flex flex-col justify-center items-center">
			<h1>You're signed in</h1>
			<p className="">Your token is: {token}</p>
		</div>
	);
}
