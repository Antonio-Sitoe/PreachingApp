import { useColorScheme } from 'nativewind';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const THEME_KEY = '@THEME_KEY';

function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { setItem, getItem } = useAsyncStorage(THEME_KEY);
  const isDark = colorScheme === 'dark';

  const toggleTheme = useCallback(async () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme from', colorScheme, 'to', newTheme);

    try {
      await setItem(newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [colorScheme, setItem, setColorScheme]);

  const initializeTheme = useCallback(async () => {
    try {
      const savedTheme = await getItem();
      const themeToSet = savedTheme === 'dark' ? 'dark' : 'light';
      console.log(
        'Initializing theme - saved:',
        savedTheme,
        'setting:',
        themeToSet
      );
      setColorScheme(themeToSet);
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setColorScheme('light');
    }
  }, [getItem, setColorScheme]);

  return {
    isDark,
    colorScheme,
    toggleTheme,
    initializeTheme,
  };
}

// Export como default e named export para compatibilidade
export default useTheme;
export { useTheme };
