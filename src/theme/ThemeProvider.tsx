import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

import { SentryService } from '@/services/sentryService';
import { DarkMaterialTheme, LightMaterialTheme } from './MaterialTheme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@potenzo_theme_mode';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  systemTheme?: 'light' | 'dark';
}

export function AppThemeProvider({ children, systemTheme = 'light' }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeMode) {
        setThemeMode(savedThemeMode as ThemeMode);
      }
    } catch (error) {
      SentryService.captureException(error, {
        message: 'Failed to load theme mode',
        source: 'ThemeProvider',
        level: 'error',
      });
    } finally {
      setIsLoaded(true);
    }
  };

  const handleSetThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      SentryService.captureException(error, {
        message: 'Failed to save theme mode',
        source: 'ThemeProvider',
        level: 'error',
      });
    }
  };

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const theme = isDark ? DarkMaterialTheme : LightMaterialTheme;

  if (!isLoaded) {
    // You can show a loading screen here if needed
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: handleSetThemeMode, isDark }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
} 