import { Text, Stack, List, Loader, Center, createStyles, Title, rem, Container } from '@mantine/core';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { DiskDiplay } from '../components/DiskDisplay';
import { FolderDisplay } from '../components/FolderDisplay';
import { Disk } from '../types';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'left',

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    textAlign: 'left',

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.md,
      textAlign: 'left',
    },
  },
}));

export default function IndexPage() {
  const [disks, setDisks] = useState<Disk[]>([]);
  const { classes, cx } = useStyles();

  async function getDisks() {
    const disksString: string = await invoke('get_disks');
    const disks = await JSON.parse(disksString);
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
    <>
      <Center>
        <Title align="center" className={classes.title}>
          Welcome to Wakubuk
        </Title>
      </Center>
      <Stack mx="xl">
        <Text size="lg" className={classes.description}>
          To get started, please select a drive to scan from the list below or a folder. You can also drag and drop a
          folder onto the app to scan it.
        </Text>
        {disks.map((disk) => (
          <DiskDiplay key={disk.name} disk={disk} />
        ))}
        <FolderDisplay />
      </Stack>
    </>
  );
}
