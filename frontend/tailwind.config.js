/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'green-deep': '#127369',
                'green-dark': '#10403B',
                'gray-green': '#8AA6A3',
                'gray-dark': '#4C5958',
            },
        },
    },
    plugins: [],
}