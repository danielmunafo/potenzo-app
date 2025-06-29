import { useColorScheme } from 'react-native';

/**
 * Hook that returns the appropriate status bar style based on the current color scheme.
 * @returns 'light-content' for dark mode, 'dark-content' for light mode
 */
export const useStatusBarStyle = (): 'light' | 'dark' => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return isDark ? 'light' : 'dark';
};
