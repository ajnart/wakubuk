import { ActionIcon, AppShell, ColorScheme, ColorSchemeProvider, Header, MantineProvider } from '@mantine/core';
import { useColorScheme, useHotkeys } from '@mantine/hooks';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IndexPage from './pages/IndexPage';
import DiskPage from './pages/AnalyzePage';
import { Notifications } from '@mantine/notifications';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

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
          <AppShell
            header={
              <Header fixed height={30} data-tauri-drag-region>
                <div unselectable="on">
                  <ActionIcon
                    pos="absolute"
                    right={5}
                    top={2}
                    variant="transparent"
                    color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {colorScheme === 'dark' ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
                  </ActionIcon>
                </div>
              </Header>
            }
          >
            <Notifications position="bottom-right" />
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/analyze" element={<DiskPage />} />
            </Routes>
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </MemoryRouter>
  );
}
