/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // darkMode: 'class',
    theme: {
        extend: {
            screens: {
                'xxs': '450px', // min-width
                'xsm': '650px',
            },
        },
        fontFamily: {
            sans: ['var(--font-poppins)']
        },
        extend: {
            scrollbar: ['rounded'],
            height: {
                '13': '3.25rem', // 52px if 1rem = 16px
            },
            boxShadow: {
                custom: "0px 0px 9px 0 rgba(197, 138, 255, 1)",
            },
            borderRadius: {
                custom: "4px", // Custom border-radius
            },
            colors: {
                primary: "#30475E",
                secondary: "#81c3d7",
                tertiary: "#222831",
                unselected: "#9DA5AF",
                kindagrey: "#F5F5F5",
                foldergrey: "#F0F4F9",
                kindablack: "#1f1f1f",
                littlelessblack: "#5e5e5e",
                basicallylight: "#FFFFFF",
                basicallydark: "#000000",
                aliceBlue: "#F0F5F9",
                columbiablue: "#C9D6DF",
                projectIconColor: "#f4b400",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [

        require('tailwind-scrollbar')

    ],
};