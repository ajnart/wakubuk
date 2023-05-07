import { Button, Card, Center, Progress, Stack, Text, Title, createStyles } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.fn.primaryColor(),
  },

  title: {
    color: theme.fn.rgba(theme.white, 0.65),
  },

  stats: {
    color: theme.white,
  },

  progressBar: {
    backgroundColor: theme.white,
  },

  progressTrack: {
    backgroundColor: theme.fn.rgba(theme.white, 0.4),
  },
}));

export default function DiskPage() {
  const { name, path, used, isFullscan, isDirectory } = useLocation().state as DiskRouteParams;
  useHotkeys([['mod+O', () => invoke('open_folder', { path })]]);
  const [status, setStatus]: any = useState();
  const { classes } = useStyles();
  const cappedTotal = Math.min(status ? status.total : 0, used);
  const percentage = (cappedTotal / used) * 100 || 0;
  const baseData = useRef<Disk | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    invoke('start_scanning', { path, full: isFullscan, ratio: isFullscan ? '0' : '0.001' });
    const scanStatusListner = listen('scan_status', (event: any) => {
      // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
      // event.payload is the payload object
      // console.log('got a scan_status event:', event.payload);
      setStatus(event.payload);
    });
    const scanFinished = listen('scan_completed', (event: any) => {
      notifications.show({
        icon: <IconCheck />,
        title: `Finished scanning "${name}"`,
        message: 'The data has been loaded',
        autoClose: 5000,
      });
      setStatus(event.payload);
      console.log('got a scan_completed event:', event.payload);
    });
    return () => {
      scanStatusListner.then((f) => f());
      scanFinished.then((f) => f());
      invoke('stop_scanning', { path });
    };
  }, []);

  return (
    <Stack style={{ height: '90vh' }}>
      <Title>Disk: {name}</Title>
      <Card withBorder radius="md" p="xl" className={classes.card}>
        <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
          Analyzing {name}
        </Text>
        <Text fz="lg" fw={500} className={classes.stats}>
          {percentage} / 100
        </Text>
        <Progress
          value={54.31}
          mt="md"
          size="lg"
          radius="xl"
          classNames={{
            root: classes.progressTrack,
            bar: classes.progressBar,
          }}
        />
        <Button onClick={() => navigate('/')}>Stop scanning</Button>
      </Card>
    </Stack>
  );
}
