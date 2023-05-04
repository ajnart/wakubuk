import { Text, Stack, List, Loader, Center, Title } from '@mantine/core';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { DiskDiplay } from '../components/DiskDisplay';

export default function Index() {
  const [disks, setDisks] = useState<Disk[]>([]);
  async function getDisks() {
    const disksString: string = await invoke('get_disks');
    const disks = JSON.parse(disksString);
    // Filter out /System/Volumes/Data on macos
    const filteredDisks = disks.filter((disk: Disk) => disk.mountPoint !== '/System/Volumes/Data');
    setDisks(filteredDisks);
  }

  // Use effect to get disks
  useEffect(() => {
    getDisks();
  }, [setDisks]);

  if (disks.length === 0) {
    return (
      <Stack h={'100vh'} justify="center" align="center">
        <Title order={3} mt={5}>
          Loading Disks...
        </Title>
        <Loader />
      </Stack>
    );
  }
  return (
    <Stack m="xl">
      {disks.map((disk) => (
        <DiskDiplay disk={disk} />
      ))}
    </Stack>
  );
}
