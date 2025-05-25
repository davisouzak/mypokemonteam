import { createSystem } from "@chakra-ui/react";

const customTheme = createSystem({
  theme: {
    colors: {
      dark: {
        50: '#f0f0f0',
        100: '#d2d2d2',
        200: '#b3b3b3',
        300: '#959595',
        400: '#767676',
        500: '#585858',
        600: '#393939',
        700: '#1b1b1b',
        800: '#121212',
        900: '#0a0a0a',
      },
    },
  },
});

export const system = customTheme;