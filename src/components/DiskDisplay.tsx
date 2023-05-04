import { createStyles, Text, Card, RingProgress, Group, rem, Switch, Badge, Code, Title, Stack } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  ring: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan('xs')]: {
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  },
}));

export function DiskDiplay({ disk }: { disk: Disk }) {
  const used = ((disk.totalSpace - disk.availableSpace) / disk.totalSpace) * 100;

  const { classes, theme } = useStyles();
  return (
    <Card withBorder shadow="md" p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <Stack spacing={'lg'}>
          <Group spacing="xs">
            <Title order={2}>{disk.name}</Title>
            <Code>{disk.mountPoint}</Code>
            <Badge ml={5} color={disk.isRemovable ? 'red' : 'blue'} variant="light">
              {disk.isRemovable ? 'External' : 'Internal'}
            </Badge>
          </Group>
          <Stack spacing="xs">
            <Group spacing="sm" key={disk.name}>
              <Text className={classes.label}>Available space:</Text>
              <Text size="md" color="dimmed">
                {(disk.availableSpace / 1e9).toFixed(0)} GB
              </Text>
            </Group>
            <Group spacing="sm" key={disk.name}>
              <Text className={classes.label}>Total space:</Text>
              <Text size="md" color="dimmed">
                {(disk.totalSpace / 1e9).toFixed(0)} GB
              </Text>
            </Group>
          </Stack>
        </Stack>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[{ value: used, color: theme.primaryColor }]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {used.toFixed(0)}%
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  Completed
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}
