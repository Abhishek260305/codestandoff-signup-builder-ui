"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme value for SSR
const defaultTheme: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'dark') {
      setTheme('dark');
    } else {
      // Always default to dark mode
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // Listen for theme changes from other tabs/pages
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue as Theme);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme as Theme);
      }
    };
    
    window.addEventListener('themechange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;
    
    // Apply theme to document element
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }, [theme, mounted]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    // Set initial theme (dark by default)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      return newTheme;
    });
  }, []);

  // During SSR or before mount, return children without provider
  // This prevents hydration mismatches
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // Guard against SSR - return default during SSR
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  const context = useContext(ThemeContext);
  
  // If context is undefined (not within provider), return default
  if (context === undefined) {
    return defaultTheme;
  }
  
  return context;
}
