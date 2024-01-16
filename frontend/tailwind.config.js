/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        fontFamily: {
            poppins: ["Poppins", "sans-serif"],
        },
        extend: {
            height: {
                '13': '3.25rem', // 52px if 1rem = 16px
              },
            boxShadow: {
                custom: "7px 7px 18px 0 rgba(197, 138, 255, 1)",
            },
            borderRadius: {
                custom: "4px", // Custom border-radius
            },
            colors: {
                primary: "#972FFF",
                secondary: "#EBD7FF",
                tertiary: "#C58AFF",
                unselected: "#9DA5AF",
                kindagrey: "#F5F5F5",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
