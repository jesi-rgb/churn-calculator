import type { Config } from 'tailwindcss'

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
                mono: ['IBM Plex Mono', "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
            }
        }
    },

    plugins: [require('daisyui')],
    daisyui: {
        logs: false,
        themes: [
            {
                light: { ...require('daisyui/src/theming/themes')['corporate'] }
            },
            { dark: { ...require('daisyui/src/theming/themes')['night'] } },
            'cupcake'
        ]
    }
} as Config
