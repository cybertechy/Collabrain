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
                <head>
                    <meta name="application-name" content="Collabrain" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="Collabrain" />
                    <meta name="description" content="An all in one Collaborative socially interactive platform" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="manifest" href="/manifest.json" />
                </head>
                <body className={`${poppins.variable} font-sans h-screen w-screen`}>{children}</body>
            </html>
        </TTSProvider>
    );
}
