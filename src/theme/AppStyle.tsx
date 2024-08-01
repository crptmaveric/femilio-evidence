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
            50: '#cdcdff',
            100: '#a8a8fc',
            200: '#8686f7',
            300: '#6666ef',
            400: '#4443eb',
            500: '#3333e2',
            600: '#2727d6',
            700: '#2b2bbc',
            800: '#2c2ca2',
            900: '#2d2d8a',
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
            brand_1: '#e5e5fc',
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
