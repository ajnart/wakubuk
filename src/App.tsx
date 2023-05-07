import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme, useHotkeys } from '@mantine/hooks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IndexPage from './pages/IndexPage';
import DiskPage from './pages/AnalyzePage';
import { Notifications } from '@mantine/notifications';

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
          <Notifications position="bottom-right" />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/analyze" element={<DiskPage />} />
          </Routes>
        </MantineProvider>
      </ColorSchemeProvider>
    </MemoryRouter>
  );
}
