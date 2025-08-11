import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('aavanamkit-theme') || 'light');
  const [accent, setAccent] = useState(() => localStorage.getItem('aavanamkit-accent') || 'theme-blue');

  useEffect(() => {
    const root = document.documentElement; // We apply classes to the main <html> tag
    
    // Handle light/dark mode class
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('aavanamkit-theme', theme);
    
    // Handle accent color class
    root.classList.remove('theme-blue', 'theme-green', 'theme-orange');
    root.classList.add(accent);
    localStorage.setItem('aavanamkit-accent', accent);

  }, [theme, accent]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const changeAccent = (newAccent) => {
    setAccent(newAccent);
  };

  return { theme, toggleTheme, accent, changeAccent };
};
