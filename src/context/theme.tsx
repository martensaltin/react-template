import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ThemeProvider as StyledProvider } from "styled-components";

import theme from "../theme.json"; // Ensure this path is correct.

interface Theme {
  theme: any;
  colorMode: string;
  setColorMode: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<Theme>({
  theme: theme.default,
  colorMode: "",
  setColorMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorMode, setColorMode] = useState(theme.default);

  const resolvedTheme = useMemo(() => {
    const themes = theme.themes as Record<string, any>;
    if (!Object.keys(themes).includes(colorMode)) {
      return theme.default;
    }
    const selectedTheme = themes[colorMode];

    return selectedTheme;
  }, [colorMode]);

  useEffect(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    if (storedColorMode) {
      setColorMode(storedColorMode);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: resolvedTheme, colorMode, setColorMode }}
    >
      <StyledProvider theme={resolvedTheme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};
