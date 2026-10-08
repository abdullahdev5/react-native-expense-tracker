import { createContext, ReactNode, useContext, useState } from "react";
import { darkTheme, lightTheme, ThemeType } from "./theme"


type ThemeContextType = {
    theme: ThemeType;
    isLight: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps  = {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isLight, setIsLight] = useState(false);

    const toggleTheme = () => {
        setIsLight(prev => !prev);
    };

    const theme = isLight ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, isLight, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider!");
    }

    return context;
}