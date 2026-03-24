import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // This sets 'Space Grotesk' as the default font (font-sans)
                sans: ["var(--font-space)", "sans-serif"],

                // This creates 'font-display' for your headings (Syne)
                display: ["var(--font-syne)", "sans-serif"],
            },
            colors: {
                // You can also add your custom colors here if needed
                orange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    500: '#f97316',
                    600: '#ea580c',
                }
            }
        },
    },
    plugins: [],
};
export default config;
