import { ColorScheme, ColorSchemeProvider, MantineProvider, Text } from '@mantine/core';
import Index from './pages';
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function App() {
  const preferredColorScheme = useColorScheme('dark');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setColorScheme(preferredColorScheme);
  }, [preferredColorScheme]);
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <MemoryRouter>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </MantineProvider>
      </ColorSchemeProvider>
    </MemoryRouter>
  );
}
