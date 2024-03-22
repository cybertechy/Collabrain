"use client";

import React, { useEffect, useState, useRef } from 'react';
import Template from '@/components/ui/template/template';
import UploadButton from '@/components/ui/button/uploadButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import PlusIcon from '@mui/icons-material/Add';
// import TeamSidebarItem from '@/components/ui/template/sidebar/sidebarSubComponents/sidebarTeamButton';
import { useRouter } from 'next/navigation';

// import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeamItem = ({ team }) =>
{
	const { name, imageUrl, channels } = team;
	// const itemClasses = isSelected ? "text-primary" : "text-unselected";
	const defaultImage = '/assets/images/imagenotFound.jpg';
	// const selectedBorder = isSelected ? "border-primary border-2 border-solid" : "group-hover:border-primary group-hover:border-2";
	const generalChannel = channels.find(channel => channel.name === 'General');
	const generalChannelId = generalChannel ? generalChannel.channelId : '';
	return (
		<Tooltip title={name} enterDelay={1000} leaveDelay={200}>
			<Link href={`chat?teamId=${team.teamId}&channelName=${"General"}`}>
				<div className={`flex flex-row items-center my-2 transition-colors duration-200 cursor-pointer hover:bg-gray-200 `}>
					<img
						src={
							// imageUrl ? imageUrl : 
							defaultImage}
						alt={name}
						className={`w-14 h-14 rounded-lg mr-2 transition-all duration-200 ease-in-out`}
					/>
					<span
						className={`text-md font-normal transition-all duration-500 ease-in-out text-black`}
					>
						{name}
					</span>
				</div>
			</Link>
		</Tooltip>
	);
};

TeamItem.propTypes = {
	team: PropTypes.shape({
		name: PropTypes.string.isRequired,
		imageUrl: PropTypes.string,
	}).isRequired
};
TeamItem;

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const ProfilePage = () =>
{
	const axios = require("axios");
	const fb = require("_firebase/firebase");

	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [isNameEditMode, setIsNameEditMode] = useState(false);
	const [isEmailEditMode, setIsEmailEditMode] = useState(false);
	const [user, loading] = fb.useAuthState();
	const [isBioEditMode, setIsBioEditMode] = useState(false);
	const [isEduEditMode, setIsEduEditMode] = useState(false);
	const [isLCEditMode, setIsLCEditMode] = useState(false);
	const [bio, setBio] = useState("");
	const [userInfo, setUserInfo] = useState({ data: { username: "User" } });
	const [education, setEducation] = useState([]);
	const [certifications, setCertifications] = useState([]);
	const [newEdu, setNewEdu] = useState({ school: '', degree: '', startYear: '', endYear: '' });
	const [newCert, setNewCert] = useState({ title: '', date: '' });
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [image, setImage] = useState(null);

	//     // let sockCli = useRef(null);
	const handleNameEditClick = async () =>
	{
		try
		{
			await saveProfileChanges({
				fname: name.split(' ')[0],
				lname: name.split(' ')[1]
			});
			setIsNameEditMode(!isNameEditMode);
		} catch (error)
		{
			console.error('Error saving profile changes:', error);
			// Handle errors here, if needed
		}
	};

	


	const saveProfileChanges = async (data) =>
	{
		console.log("Saving profile changes...");
		console.log("education: ", education);
		const updatedUserInfo = data

		if (Object.keys(updatedUserInfo).length === 0) return;

		try
		{
			const token = await fb.getToken(); // Retrieve the current user's auth token
			console.log("New certifications are: ", updatedUserInfo.certifications);
			await axios.patch(`${SERVERLOCATION}/api/users/`, updatedUserInfo, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Profile updated successfully.");
			setIsBioEditMode(false);
			setIsEduEditMode(false);
			setIsLCEditMode(false);
			// Handle successful update (e.g., show a message to the user)
		} catch (error)
		{
			console.error("Error updating profile:", error);
			// Handle errors (e.g., show error message)
		}
	};


	//add user entries to a list
	const addEducation = async () =>
	{
		if (newEdu.school && newEdu.degree && newEdu.startYear && newEdu.endYear)
		{
			setEducation(prevEdu => [...prevEdu, newEdu]);
			setNewEdu({ school: '', degree: '', startYear: '', endYear: '' });
			await saveProfileChanges({
				education: [...education, newEdu]
			}); // Save changes after adding
		}
		else {
			toast.error("Please fill in all fields",{
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored"
			});
		}
	};

	const addCertification = async () =>
	{
		if (newCert.title && newCert.date)
		{
			// Update certifications state first
			console.log("Adding certification: ", certifications);
			let updatedCertifications = [...certifications, newCert];
			setCertifications(updatedCertifications);
			setNewCert({ title: '', date: '' });
			try
			{
				// Now, call saveProfileChanges to save the changes including certifications
				await saveProfileChanges({
					certifications: [...certifications, newCert]
				});
			} catch (error)
			{
				console.error('Error saving profile changes:', error);
				// Handle errors here, if needed
			}
		} else {
			toast.error("Please fill in all fields",{
				position: "bottom-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored"
			});
		
		}
	};



	useEffect(() =>
	{
		if (!user) return;

		const fetchUser = async () =>
		{
			setIsLoading(true);
			setError(null);

			try
			{
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/users/${user.uid}`, {
					headers: { "Authorization": "Bearer " + token }
				});

				if (response.status === 200)
				{
					// Assuming the response data structure matches the one you've provided
					console.log(response.data);
					const { fname, lname, email, photo, bio, education, certifications } = response.data;

					setUsername(response.data.username);
					setName(`${fname} ${lname}`);
					setEmail(email);
					setImage(photo);
					setBio(bio); // Set bio from response
					setEducation(education); // Set education from response
					setCertifications(certifications || []); // Set certifications from response

					// Navigate to the profile page with updated information
					const newPath = `/profile?username=${response.data.username}`;
					router.push(newPath);
				} else
				{
					setError('Failed to display content');
				}
			} catch (error)
			{
				setError('Error displaying profile');
				console.error('Error:', error);
			} finally
			{
				setIsLoading(false);
			}
		};
		fetchUser();



		const fetchUserTeams = async () =>
		{
			setIsLoading(true);
			setError(null);


			try
			{
				// Make a GET request to retrieve user's team IDs
				const token = await fb.getToken();
				const response = await axios.get(`${SERVERLOCATION}/api/teams`, {
					headers: {
						Authorization: `Bearer ${token}`, // Replace with the actual auth token
					},
				});

				// Check if the request was successful
				if (response.status === 200)
				{
					const teamIds = response.data;

					// Create an array of promises to fetch team information
					const teamPromises = teamIds.map(async (teamId) =>
					{
						const teamResponse = await axios.get(`${SERVERLOCATION}/api/teams/${teamId}`, {
							headers: {
								Authorization: `Bearer ${token}`, // Replace with the actual auth token
							},
						});

						// Check if the request for team information was successful
						if (teamResponse.status === 200)
						{
							// Merge teamId with the team data
							return {
								teamId,
								...teamResponse.data
							};
						} else
						{
							console.error('Failed to fetch team information:', teamResponse.statusText);
							return null;
						}
					});

					// Use Promise.all to wait for all promises to resolve
					const teamsData = await Promise.all(teamPromises);

					// Filter out any null values (failed requests)
					const filteredTeamsData = teamsData.filter((teamInfo) => teamInfo !== null);

					// Update the userTeams state with the array of team information
					setUserTeams(filteredTeamsData);
					console.log(filteredTeamsData);
				} else
				{
					throw new Error('Failed to fetch user teams');
				}
			} catch (error)
			{
				console.error('Error fetching user teams:', error);
				// You can handle errors and provide user feedback here
			} finally
			{
				setIsLoading(false);
			}
		};

		// Call the function to fetch user teams when the component mounts
		fetchUserTeams();
	}, [user]);
	const handleBioEditClick = async () =>
	{
		if (isBioEditMode)
		{
			// Attempt to save changes when exiting bio edit mode
			await saveProfileChanges();
		}
		setIsBioEditMode(!isBioEditMode); // Toggle edit mode regardless of save success
	};

	const handleEducationSaveClick = async () =>
	{
		if (isEduEditMode)
		{
			// Exiting edit mode, implicitly add the new education entry (if valid) and save all changes
			await addEducation(); // Ensure this function now also calls saveProfileChanges
		}
		setIsEduEditMode(!isEduEditMode);
	};


	const handleCertificationSaveClick = async () =>
	{
		if (isLCEditMode)
		{
			// Exiting edit mode, implicitly add the new certification (if valid) and save all changes
			await addCertification(); // Ensure this function now also calls saveProfileChanges
		}
		setIsLCEditMode(!isLCEditMode);
	};


	useEffect(() =>
	{
		// get axios request to fetch user info 
		if (!image) return;
		if (typeof image !== "string") return;
		fb.getToken().then((token) =>
		{
			console.log("Fetch Image: ", image);
			let response = axios.get(`${SERVERLOCATION}/api/storage/media/${image}`, {
				headers: { Authorization: "Bearer " + token }
			});

			response.then((res) =>
			{
				setImage(res.data);
			});
		});
	}, [image]);

	const [userTeams, setUserTeams] = useState(null);


	const uploadImage = async (file, type) =>
	{
		try
		{
			const token = await fb.getToken();

			//send the photo and type as Patch body
			const response = await axios.patch(`${SERVERLOCATION}/api/users/`, {
				photo: file,
				type: type
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200)
			{
				return response.data;
			} else
			{
				throw new Error('Failed to upload image');
			}
		}
		catch (error)
		{
			console.error('Error uploading image:', error);
			// You can handle errors and provide user feedback here
		}
	};

	return (
		<div className='overflow-auto mb-5'>
		<ToastContainer />
			<div
				className="p-4 container focus:outline-none focus:border-primary text-gray-500">
				<h2 className="text-lg font-bold text-tertiary text-left font-poppins"> Edit your information here @{username}</h2>
			</div>
			<div className="container mx-auto px-4 pt-8 2xl:w-5/6">
				<div className="flex flex-col space-x-4 md:flex-row 2xl:space-x-4 mb-6 max-md:space-y-4 max-md:space-x-0">
					{/* Profile card */}
					<div className="bg-white rounded-lg p-4 md:mb-0 border border-primary border-opacity-30 shadow-sm">
						<div className="text-center">
							<div className="mb-4">
								<UploadButton
									onUpload={uploadImage}
									photo={image}
								/>
							</div>
							<div className='relative mb-4 flex items-center ml-6'>
								<input
									type="text"
									placeholder="Enter your name"
									value={name}
									onChange={(e) =>
										setName(e.target.value)
									}
									className={`bg-white text-lg font-bold text-center border-0 p-2 w-full text-black ${isNameEditMode && 'border-2 rounded-lg'}`}
									disabled={!isNameEditMode}
								/>
								{isNameEditMode ?
									<SaveIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleNameEditClick} />
									:
									<EditIcon className={`text-primary ml-2 cursor-pointer`} onClick={handleNameEditClick} />}
							</div>
							<div className='relative mb-4 flex items-center ml-6'>
								<input
									type="text"
									placeholder="Enter your updated email"
									value={email}
									onChange={(e) =>
										setEmail(e.target.value)
									}
									className={`bg-white text-lg text-center border-0 w-full text-black ${isEmailEditMode && 'border-2 rounded-lg'}`}
									disabled={!isEmailEditMode}
								/>
								
							</div>
							{/* <p className="text-lg text-black">{email}</p>  */}
						</div>
					</div>

					{/* Biography Section */}
					<div className="rounded-lg p-4 flex-1 md:w-2/3 border border-primary border-opacity-30 shadow-sm">
						<div className='flex items-center mb-4'>
							<h3 className="font-bold text-lg text-black">Biography</h3>
							{isBioEditMode ?
								<SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={handleBioEditClick} />
								:
								<EditIcon className={`text-primary ml-auto cursor-pointer`} onClick={handleBioEditClick} />}
						</div>
						<TextareaAutosize
							minRows={3}
							style={{ width: '100%', height: '80%', resize: 'none' }}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="border p-2 b-2 rounded-md focus:outline-none focus:border-primary text-black"
							placeholder="Your biography here"
							disabled={!isBioEditMode}
						/>
					</div>
				</div>

				{/* Education & Certifications */}
				<div className="flex flex-col md:flex-row md:space-x-4">
					<div className="rounded-lg p-4 mb-6 flex flex-col w-full md:w-1/2 border border-primary border-opacity-30 shadow-sm h-min">
						<div className='flex items-center'>
							<h3 className="font-bold text-lg text-black pb-2">Education</h3>
							{isEduEditMode ?
								<SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={addEducation} />
								:
								<PlusIcon className={`text-primary ml-auto cursor-pointer`} onClick={() => setIsEduEditMode(true)} />}
							{/* Education details */}
						</div>
						{isEduEditMode ? (
							<div className='flex flex-col'>
								{/* Input fields for education details */}
								<input
									type="text"
									value={newEdu.school}
									onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
									className="mt-2 p-2 border-2 rounded text-tertiary"
									placeholder="School name..."
								/>
								<input
									type="text"
									value={newEdu.degree}
									onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
									className="mt-2 p-2 border-2 rounded text-tertiary"
									placeholder="Degree..."
								/>
								{/* Inputs for start and end year */}
								<div className="flex flex-auto space-x-4 items-center">
									<input
										type="number"
										value={newEdu.startYear}
										onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
										className="mt-2 p-2 w-3/4 border-2 rounded text-tertiary"
										placeholder="Start Year..."
										min="1900"
										step="1" //whole numbers
									/>
									<h4 className='text-tertiary pt-2'> - </h4>
									<input
										type="number"
										value={newEdu.endYear}
										onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
										className="mt-2 p-2 w-3/4 border-2 rounded text-tertiary"
										placeholder="End Year..."
										min="1900"
										step="1"
									/>
								</div>
							</div>
						) : (
							<>
								<ul className='text-tertiary'>
									{education?.map((edu, index) => (
										<li key={index}>
											<hr className="border-t-1 mx-1 border-solid border-gray-400 opacity-30 py-1"></hr>
											<i>{edu.degree}</i> from <i>{edu.school}</i> ({edu.startYear} - {edu.endYear})
										</li>
									))}
								</ul>
							</>
						)}
						{/* </div> */}
					</div>


					<div className="rounded-lg p-4 mb-6 flex flex-col w-full md:w-1/2 border border-primary border-opacity-30 shadow-sm h-min">
						<div className='flex items-center'>
							<h3 className="font-bold text-lg text-black pb-2">Licenses & Certifications</h3>
							{isLCEditMode ?
								<SaveIcon className={`text-primary ml-auto cursor-pointer`} onClick={addCertification} />
								:
								<PlusIcon className={`text-primary ml-auto cursor-pointer`} onClick={() => setIsLCEditMode(true)} />}
							{/* Certifications list */}
						</div>
						{isLCEditMode ? (
							<div className='flex flex-col'>
								{/* Input fields for certification details */}
								<input
									type="text"
									value={newCert.title}
									onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
									className="mt-2 p-2 border-2 rounded text-tertiary"
									placeholder="Certification title..."
								/>
								<input
									type="date"
									value={newCert.date}
									onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
									className="mt-2 p-2 border-2 rounded text-tertiary"
									placeholder="Date obtained..."
								/>
							</div>
						) : (
							<ul className='text-tertiary'>
								{certifications?.map((cert, index) => (
									<li key={index}>
										<hr className="border-t-1 mx-1 border-solid border-gray-400 opacity-30 py-1"></hr>
										<i>{cert.title}</i>, obtained on {cert.date}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className={`rounded-lg p-4 flex flex-col w-full border border-primary border-opacity-30 shadow-sm`}>
					<h3 className="font-bold text-lg text-black pb-2">Your Teams</h3>
					{userTeams ? userTeams?.map((team, index) => (
						<TeamItem key={index} team={team}
							onClick={router.forward(`chat?teamId=${team.teamId}`)}
						/>
					)) : null}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
