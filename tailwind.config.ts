import type { Config } from 'tailwindcss'

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter'],
                mono: ['IBM Plex Mono']
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
