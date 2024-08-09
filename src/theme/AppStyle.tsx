const palette = {
    purple: '#4443EB',
    green: '#05FE00',
    mint: '#47edc1',
    black: '#0B0B0B',
    white: '#F0F2F3',
    red: '#FF8989',
    orange: '#FFBE16',
    gray: 'rgba(118,118,128,0.12)',
};

export const theme = {
    colors: {
        primary: {
            '50': '#fef2f2',
            '100': '#fee2e2',
            '200': '#fecaca',
            '300': '#fda4a4',
            '400': '#f97272',
            '500': '#f04343',
            '600': '#dd2525',
            '700': '#ba1b1b',
            '800': '#9a1a1a',
            '900': '#801c1c',
            '950': '#450a0a',
        },

        danger: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
        },
        background: {
            gray_1: '#F2F2F7',
            gray_2: 'rgba(0, 0, 0, 0.48)',
            brand_1: '#FFF1E5',
            brand_2: '#fcf4f3',
        },
        labels: {
            secondary: 'rgba(60,60,68,0.6)',
        },
        foreground: palette.black,
        secondary: palette.mint,
        success: palette.green,
        warning: palette.orange,
        failure: palette.red,
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
    },
    radius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
    },
};

export const appStyle = {
    ...theme,
    colors: {
        ...theme.colors,
    },
};
