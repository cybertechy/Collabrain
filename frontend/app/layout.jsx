import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { TTSProvider, useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"

import localFont from 'next/font/local'
const inter = Inter({ subsets: ["latin"] });

const poppins = localFont({
    src: [
        {
            path: '../public/fonts/Poppins-Regular.ttf',
            weight: '400'
        },
        {
            path: '../public/fonts/Poppins-Bold.ttf',
            weight: '700'
        },
        {
            path: '../public/fonts/Poppins-Light.ttf',
            weight: '300'
        },
        {
            path: '../public/fonts/Poppins-Medium.ttf',
            weight: '500'
        },
        {
            path: '../public/fonts/Poppins-SemiBold.ttf',
            weight: '600'
        },
        {
            path: '../public/fonts/Poppins-ExtraBold.ttf',
            weight: '800'
        },
        {
            path: '../public/fonts/Poppins-Black.ttf',
            weight: '900'
        },
        {
            path: '../public/fonts/Poppins-Italic.ttf',
            weight: '400',
            style: 'italic'
        }
    ],
    
    variable: '--font-poppins'
  })
export const metadata = {
    title: "Collabrain",
    description: "An Interactive Collaborative Platform, Now you can socially interact and collaborate with your friends and colleagues with ease.",
};
  
export default function RootLayout({ children }) {
    return (
        <TTSProvider>
        <html lang="en">
            <body className={`${poppins.variable} font-sans h-screen w-screen`}>{children}</body>
        </html>
        </TTSProvider>
    );
}
