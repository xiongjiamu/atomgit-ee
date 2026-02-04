/** @type {import('tailwindcss').Config} */
export default {
        content: [
                "./index.html",
                "./src/**/*.{vue,js,ts,jsx,tsx}",
        ],
        darkMode: "class",
        theme: {
                extend: {
                        screens: {
                                'full-hd': '1920px',
                        },
                        colors: {
                                primary: "#3b82f6",
                                "background-light": "#f3f4f6",
                                "background-dark": "#0f172a",
                                "surface-light": "#ffffff",
                                "surface-dark": "#1e293b",
                                "border-light": "#e2e8f0",
                                "border-dark": "#334155",
                        },
                        fontFamily: {
                                display: ["Noto Sans SC", "Inter", "sans-serif"],
                                body: ["Noto Sans SC", "Inter", "sans-serif"],
                        },
                        borderRadius: {
                                DEFAULT: "0.5rem",
                        },
                },
        },
        plugins: [],
}
