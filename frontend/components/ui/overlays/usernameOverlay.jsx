import React, { useState, useEffect } from 'react';
const fb = require("../../../app/_firebase/firebase");
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UsernameOverlay = ({ isOpen, onClose }) =>
{
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const [user, loading] = fb.useAuthState();
	const [retrieve, setRetrieve] = useState(false);
	const [timeoutId, setTimeoutId] = useState(null);
	const [hasUserUsername, setHasUserUsername] = useState(null);
	const [isCheckingUsername, setIsCheckingUsername] = useState(true);

	const hasUsername = async () => {
        const token = await fb.getToken();
        const uid = fb.getUserID();

        try {
            const res = await axios.get(`http://localhost:8080/api/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = res.data;
			
			console.log("Overlay open: " + isOpen);
            return user.username ? true : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    };
    useEffect(() => {
		const checkUsername = async () => {
			if (user) {
				setIsCheckingUsername(true);
				try {
					const result = await hasUsername();
					setHasUserUsername(result);
				} catch (err) {
					console.log(err);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
	
		checkUsername();
	}, [user]);
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
			const response = await axios.get(`http://localhost:8080/api/users/username/${enteredUsername}`);
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
			const response = await axios.patch('http://localhost:8080/api/users/', { username: username }, {
				headers: {
					authorization: `Bearer ${token}`
				}
			});
	
			if (response.status === 200) {
				setHasUserUsername(true); // Update this state to indicate the user now has a username
				onClose(); // Close the overlay
			} else {
				setError("Failed to update username");
			}
		} catch (error) {
			setError("Error updating username");
		}
	};

	if (loading || !user || isCheckingUsername) return (
		<div className="flex flex-col items-center justify-around min-h-screen">
		  <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold mb-5 text-primary">Trying to sign in</h1>
                <div className="loader mb-5"></div>

                <p className="text-lg font-bold text-primary mb-5 ">
                    If you're not signed in, sign in&nbsp;
                    <span className="underline cursor-pointer" onClick={() => router.push("/")}>
                        here
                    </span>
                </p>
            </div>
        </div>
    );
	return (
		<div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${user && !hasUserUsername ? 'block' : 'hidden'} z-50 bg-white bg-opacity-20 backdrop-blur-sm`}>
		<div className="w-1/4 bg-white rounded-md shadow-lg">
				<div className="p-8">
					<h2 className="text-2xl font-bold mb-4 text-black">Welcome! Let's Pick a Username</h2>
					<p className="mb-4 text-gray-600">Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!</p>
					<input
						type="text"
						className={`w-full text-black p-2 border ${error && error !== "Username is available" ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-primary`}
						placeholder="Enter your username"
						value={username}
						onChange={handleUsernameChange}
					/>
					<p className={`text-sm mt-1 ${error === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
						{retrieve ? "Checking availability..." : error}
					</p>
					<div className="mt-4 flex justify-between">
          <button
							className="px-4 py-2 bg-primary text-white rounded hover:bg-teritary"
							onClick={fb.signOut}
							
						>
							Sign out
						</button>
						<button
							className="px-4 py-2 bg-primary text-white rounded hover:bg-teritary"
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

