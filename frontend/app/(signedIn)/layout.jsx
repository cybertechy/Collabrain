"use client";

import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import Template from "_components/ui/template/template";
import { TTSProvider, useTTS } from "@/app/utils/tts/TTSContext";

import localFont from 'next/font/local';

const poppins = localFont({
	src: [
		{
			path: '../../public/fonts/Poppins-Regular.ttf',
			weight: '400'
		},
		{
			path: '../../public/fonts/Poppins-Bold.ttf',
			weight: '700'
		},
		{
			path: '../../public/fonts/Poppins-Light.ttf',
			weight: '300'
		},
		{
			path: '../../public/fonts/Poppins-Medium.ttf',
			weight: '500'
		},
		{
			path: '../../public/fonts/Poppins-SemiBold.ttf',
			weight: '600'
		},
		{
			path: '../../public/fonts/Poppins-ExtraBold.ttf',
			weight: '800'
		},
		{
			path: '../../public/fonts/Poppins-Black.ttf',
			weight: '900'
		},
		{
			path: '../../public/fonts/Poppins-Italic.ttf',
			weight: '400',
			style: 'italic'
		}
	],

	variable: '--font-poppins'
});

export default function RootLayout({ children })
{
	return (
		<TTSProvider>
		<html lang="en">
			<body className={`${poppins.variable} font-sans h-screen w-screen`}>
				<Template>
					{children}
				</Template>
			</body>
		</html>
		</TTSProvider>
	);
}
