import { ActionIcon, Badge, Button, Card, Code, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconExternalLink } from '@tabler/icons-react';
import { FileTreeDisplay } from '../components/FileTreeDisplay';
import { DiskRouteParams } from '../types';
import { formatBytes, parseDataStructure } from '../tools/parsing';

export default function DiskPage() {
  const { name, path, used, isFullscan, isDirectory } = useLocation().state as DiskRouteParams;
  useHotkeys([['mod+O', () => invoke('open_folder', { path })]]);
  const [status, setStatus]: any = useState();
  const cappedTotal = Math.min(status ? status.total : 0, used);
  const percentage = (cappedTotal / used) * 100 || 0;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  console.log({ name, path, used, isFullscan });

  useEffect(() => {
    invoke('start_scanning', { path, full: isFullscan, ratio: isFullscan ? '0.000001' : '0.001' });
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
      setIsLoading(false);
    });
    return () => {
      scanStatusListner.then((f) => f());
      scanFinished.then((f) => f());
      invoke('stop_scanning', { path });
    };
  }, []);
  if (isLoading) {
    return (
      <Stack style={{ height: '80vh' }}>
        <Title>Disk: {name}</Title>
        <Card withBorder radius="md" m="xl" p="xl">
          <Stack>
            <Text fz="xs" tt="uppercase" fw={700}>
              Analyzing {name}
            </Text>
            <Text fz="lg" fw={500}>
              {percentage.toFixed(2)}% of {name} scanned
            </Text>
            <Progress value={percentage} striped mt="md" animate size="xl" radius="md" />
            <Button onClick={() => navigate('/')}>Stop scanning</Button>
          </Stack>
        </Card>
      </Stack>
    );
  }
  const data = parseDataStructure(status);
  return (
    <Stack>
      <Group>
        <Code>{path}</Code>
        <Badge size="md" variant="filled">
          {formatBytes(data.tree.data)}
        </Badge>
        <Tooltip label="Open folder in file manager" position="right">
          <ActionIcon onClick={() => invoke('open_folder', { path, inside: true })}>
            <IconExternalLink />
          </ActionIcon>
        </Tooltip>
      </Group>
      <FileTreeDisplay data={data} name={name} />
    </Stack>
  );
}
