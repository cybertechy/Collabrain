import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Collabrain",
    description: "An Interactive Collaborative Platform, Now you can socially interact and collaborate with your friends and colleagues with ease.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="flex justify-center items-center h-screen w-screen">
                {children}
            </body>
        </html>
    );
}
