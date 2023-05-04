import { Title } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
import { useHotkeys } from '@mantine/hooks';

export default function DiskPage() {
  const { name, path, used, isFullscan, isDirectory } = useLocation().state as DiskRouteParams;
  useHotkeys([['mod+O', () => invoke('open_folder', { path })]]);

  useEffect(() => {
    invoke('start_scanning', { path, full: isFullscan });
  }, []);

  console.log(name, path);
  return <Title>Disk: {name}</Title>;
}
