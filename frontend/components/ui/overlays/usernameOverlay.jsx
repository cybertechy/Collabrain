import React, { useState, useEffect } from 'react';
const fb = require("../../../app/_firebase/firebase");
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UsernameOverlay = ({ onClose, hasUserUsername, setHasUserUsername }) =>
{
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const [user, loading] = fb.useAuthState();
	const [retrieve, setRetrieve] = useState(false);
	const [timeoutId, setTimeoutId] = useState(null);

	const checkUsernameAvailability = async (enteredUsername) =>
	{
		if (!/^[a-zA-Z0-9_]{4,}$/.test(enteredUsername))
		{
			setError("Username must be at least 4 characters and alphanumeric (including underscores)");
			return;
		}

		setRetrieve(true);
		setError('');

		try
		{
			const response = await axios.get(`https://collabrain-backend.cybertech13.eu.org/api/users/username/${enteredUsername}`);
			if (response.status === 200)
			{
				setError("Username is available");
				setUsername(enteredUsername);
				console.log("Username is available");
			} else
			{
				setError("Username is taken");
			}
		} catch (error)
		{
			if (error.response && error.response.status === 400)
			{
				setError("Username is taken");
			} else
			{
				setError("Error checking availability");
			}
		} finally
		{
			setRetrieve(false);
		}
	};
	const handleUsernameChange = (e) =>
	{
		const newUsername = e.target.value;
		setUsername(newUsername);

		if (timeoutId)
		{
			clearTimeout(timeoutId);
		}

		const newTimeoutId = setTimeout(() =>
		{
			checkUsernameAvailability(newUsername);
		}, 1000); //delay before checking username availability

		setTimeoutId(newTimeoutId);
	};
	const handleSave = async () => {
		if (error !== "Username is available" || !username) {
			toast.error(error);
			return;
		}
	
		try {
			let token = null;
			if (user) {
				token = await fb.getToken();
			}
			const response = await axios.patch('https://collabrain-backend.cybertech13.eu.org/api/users/', { username: username }, {
				headers: {
					authorization: `Bearer ${token}`
				}
			});
	
			if (response.status === 200) {
				console.log(response.data);
				setHasUserUsername(true); // Update this state to indicate the user now has a username
				onClose(); // Close the overlay
			} else {
				console.log("failed to update username")
				setError("Failed to update username");
			}
		} catch (error) {
			console.error("Error updating username:", error);
			setError("Error updating username");
		}
	};

	if (loading || !user) return;
	return (
		<div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-basicallylight bg-opacity-20 backdrop-blur-sm`}>
		<div className="w-1/4 bg-basicallylight rounded-md shadow-lg">
				<div className="p-8">
					<h2 className="text-2xl font-bold mb-4 text-basicallydark">Welcome! Let's Pick a Username</h2>
					<p className="mb-4 text-gray-600">Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!</p>
					<input
						type="text"
						className={`w-full text-basicallydark p-2 border ${error && error !== "Username is available" ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
						placeholder="Enter your username"
						value={username}
						onChange={handleUsernameChange}
					/>
					<p className={`text-sm mt-1 ${error === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
						{retrieve ? "Checking availability..." : error}
					</p>
					<div className="mt-4 flex justify-between">
          <button
							className="px-4 py-2 bg-primary text-basicallylight rounded hover:bg-teritary"
							onClick={fb.signOut}
							
						>
							Sign out
						</button>
						<button
							className="px-4 py-2 bg-primary text-basicallylight rounded hover:bg-teritary"
							onClick={handleSave}
							disabled={retrieve || error !== "Username is available"}
						>
							Let's Go!
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsernameOverlay;

