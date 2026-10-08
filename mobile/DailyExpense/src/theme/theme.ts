import { darkColors, lightColors } from "./colors";
import { radius, spacing } from "./sizes";
import { fontSize } from "./typography";


const baseTheme = {
    fontSize,
    spacing,
    radius
}

export const darkTheme = {
    ...baseTheme,
    colors: darkColors
};


export const lightTheme = {
    ...baseTheme,
    colors: lightColors,
};


export type ThemeType = typeof darkTheme;