import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
const { useRouter } = require("next/navigation");
import fb from '../../../app/_firebase/firebase';
import axios from 'axios';
import { toast } from 'react-toastify';
const ContentMapBackground = () => (
	<svg width="597" height="519" viewBox="0 0 597 519" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="196.083" y1="462.442" x2="105.083" y2="397.061" stroke="#30475E" stroke-width="10"/>
<circle cx="217.5" cy="481.5" r="37.5" fill="#81C3D7"/>
<line x1="47.8544" y1="237.802" x2="85.8544" y2="391.802" stroke="#30475E" stroke-width="10"/>
<circle cx="98" cy="393" r="55" fill="#81C3D7"/>
<path d="M-28 338.5L47 242.5" stroke="#30475E" stroke-width="10"/>
<line x1="56.3722" y1="239.441" x2="-35.6278" y2="142.441" stroke="#30475E" stroke-width="10"/>
<line x1="62.2747" y1="-14.5474" x2="-29.7253" y2="32.4526" stroke="#30475E" stroke-width="10"/>
<line x1="570.711" y1="82.7658" x2="491.711" y2="13.7658" stroke="#30475E" stroke-width="10"/>
<line x1="367.189" y1="35.0663" x2="488.819" y2="15.0663" stroke="#30475E" stroke-width="10"/>
<line x1="334.372" y1="28.4408" x2="242.372" y2="-68.5592" stroke="#30475E" stroke-width="10"/>
<circle cx="48" cy="236" r="25" fill="#81C3D7"/>
<circle cx="486" cy="6" r="25" fill="#81C3D7"/>
<circle cx="572" cy="79" r="25" fill="#81C3D7"/>
<circle cx="346.5" cy="39.5" r="31.5" fill="#81C3D7"/>
</svg>

  );
const NewProjectOverlay = ({ toggleModal, modalVisible }) =>
{
	const [currentScreen, setCurrentScreen] = useState("contentMap");

	const switchToContent = () => setCurrentScreen("contentMap");
	const switchToDocument = () => setCurrentScreen("document");

	return (
		modalVisible && (
			<div>
				<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-basicallylight bg-opacity-20 backdrop-blur-sm">
					{currentScreen === "contentMap" && (
						<ContentMapOverlay setOpenModal={toggleModal} switchToDocument={switchToDocument} />
					)}
					{currentScreen === "document" && (
						<DocumentOverlay switchToContent={switchToContent} setOpenModal={toggleModal} />
					)}
				</div>
			</div>
		)
	);
};

const ContentMapOverlay = ({ setOpenModal, switchToDocument }) =>
{
	const router = useRouter();
	const NewContentMap = async () =>
	{
		let token = await fb.getToken();
		if (!token) return null;

		try
		{
			const res = await axios.post(`https://collabrain-backend.cybertech13.eu.org/api/maps`, {
				name: "New Content Map",
				data: ""
			}, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});


			if (res.status !== 200) return null;



			router.push(`/contentmap?id=${res.data.id}`);
		}
		catch (err)
		{
			console.log(err);
			toast.error("Error creating new content map", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				theme: "colored"
			});

			return null;
		}
	};

	return (
		<>
			<div className="w-screen h-screen flex items-center justify-center">
				<div className="w-full h-10/12 max-xs:h-2/3 sm:h-2/3 sm:w-2/3 shadow-lg bg-basicallylight rounded-md ">
					<div className="bg-[url('/assets/images/bgDesign.png')] w-full h-fit bg-contain bg-no-repeat bg-left">
						<div className="flex justify-end">
							<button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' onClick={setOpenModal}>
								<CloseIcon fontSize="large" />
							</button>
						</div>
						<div className=" text-center mt-24 flex justify-center">
							<p className='text-2xl block text-center font-light'>Choose the type of project you would like to create</p>
						</div>
						<div className=" h-32 mt-30 justify-center grid grid-rows-2 gap-10">

							<button className="flex mt-11 mr-10 w-56 h-16 text-basicallylight font-normal rounded text-lg  dark:bg-primary dark:hover:bg-primary">
								<img className='h-6 mt-4 ml-3' src='/assets/images/content.png' />
								<p className="mt-4 ml-8">Content Map</p></button>
							<button className="flex mt-11 mr-10 w-56 h-16 text-basicallydark font-normal rounded text-lg" onClick={switchToDocument}>
								<p className="mt-4 ml-16">Document</p></button>
						</div>
						<div className="mt-36 flex justify-end">
							<button onClick={NewContentMap} className="mr-10 w-44 h-12  text-basicallylight bg-primary hover:bg-primary  font-normal rounded text-lg shadow-xl ">Create Project</button>
						</div>
					</div>
				</div>
			</div>

		</>
	);
};

const DocumentOverlay = ({ setOpenModal, switchToContent }) =>
{
	const router = useRouter();
	return (
		<>
			<div className="w-screen h-screen flex items-center justify-center">
				<div className="w-2/4 h-3/5 shadow-lg bg-basicallylight rounded-md ">
					<div className="flex justify-end">
						<button className=' bg-transparent border-none text-25 cursor-pointer pr-2 pt-2' onClick={setOpenModal}>
							<CloseIcon fontSize="large" />
						</button>
					</div>
					<div className=" text-center mt-24 flex justify-center">
						<p className='text-2xl block text-center font-light'>Choose the type of project you would like to create</p>
					</div>
					<div className="bg-[url('/assets/images/bgDesign2.png')] w-full h-28 bg-contain bg-no-repeat bg-left">
						<div className=" h-32 mt-30 justify-center grid grid-rows-2 gap-10">

							<button className="flex mt-11 mr-10 w-56 h-16 text-basicallydark font-normal rounded text-lg " onClick={switchToContent}>
								<p className="mt-4 ml-16">Content Map</p></button>
							<img className='h-7 mt-4 ml-3' src='/assets/images/doc.png' />
							<button className="flex mt-11 mr-10 w-56 h-16 text-basicallylight font-normal rounded text-lg dark:bg-primary dark:hover:bg-primary">
								<img className='h-7 mt-4 ml-3' src='/assets/images/doc.png' />
								<p className="mt-4 ml-10">Document</p></button>
						</div>
						<div className="mt-36 flex justify-end">
							<button onClick = {()=>{router.push('/document')}}className="mr-10 w-44 h-12  text-basicallylight bg-primary hover:bg-primary  font-normal rounded text-lg shadow-xl ">Create Project</button>
						</div>
					</div>

				</div>
			</div>

		</>
	);
};
export default NewProjectOverlay;
