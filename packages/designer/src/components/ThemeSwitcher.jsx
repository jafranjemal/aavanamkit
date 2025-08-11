import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme, accent, changeAccent } = useTheme();

  return (
    <div className="ak-flex ak-items-center ak-space-x-2 ak-p-1 ak-rounded-full ak-bg-muted">
      <button
        onClick={toggleTheme}
        className={`ak-p-2 ak-rounded-full ${theme === 'light' ? 'ak-bg-primary ak-text-primary-foreground' : 'ak-text-muted-foreground'}`}
      >
        <FaSun />
      </button>
      <button
        onClick={toggleTheme}
        className={`ak-p-2 ak-rounded-full ${theme === 'dark' ? 'ak-bg-primary ak-text-primary-foreground' : 'ak-text-muted-foreground'}`}
      >
        <FaMoon />
      </button>
    </div>
  );
};
