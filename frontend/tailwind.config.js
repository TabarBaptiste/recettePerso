/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'dark': {
                    '900': '#0a0a0f',
                    '800': '#12121a',
                    '700': '#1a1a24',
                    '600': '#24242f',
                    '500': '#2e2e3a',
                },
                'blue': {
                    '500': '#3b82f6',
                    '600': '#2563eb',
                    '700': '#1d4ed8',
                },
                'gray': {
                    '300': '#d1d5db',
                    '400': '#9ca3af',
                    '500': '#6b7280',
                },
            },
        },
    },
    plugins: [],
}
