import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const themeList = [
  { id: 'premium-dark', icon: 'P', desc: 'Premium Dark' },
];

export function ThemeProvider({ children }) {
  const theme = 'premium-dark';
  const appearance = 'dark';

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-appearance');
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem('theme', theme);
    localStorage.setItem('appearance', appearance);
  }, []);

  const setTheme = () => {};
  const toggleAppearance = () => {};
  const setAppearance = () => {};

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, themes: themeList,
      appearance, toggleAppearance, setAppearance
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
