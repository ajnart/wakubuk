import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, rem, Card, Flex } from '@mantine/core';
import { IconSwimming } from '@tabler/icons-react';

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'visible',
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    '&:hover': {
      // Cool hover effect, makes the button 10% larger in 0.3s
			transform: 'scale(1.02)',
			transition: 'transform 0.1s ease-in-out',
    },
  },

  icon: {
    position: 'absolute',
    top: `calc(-${ICON_SIZE} / 3)`,
    left: `calc(50% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

export function DiskDiplay({ disk }: { disk: Disk }) {
  const { classes } = useStyles();

  const used = ((disk.totalSpace - disk.availableSpace) / disk.totalSpace) * 100;

  return (
    <Card radius="md" withBorder className={classes.card}>
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        <IconSwimming size="2rem" stroke={1.5} />
      </ThemeIcon>
      <Text ta="center" fw={700} className={classes.title}>
        {disk.name}
      </Text>
      <Text c="dimmed" ta="center" fz="sm">
        {disk.mountPoint}
      </Text>

      <Group mt="xs">
        <Badge size="md">{(disk.availableSpace / 1e9).toFixed(1)} GB Free</Badge>
        <Badge size="md">{(disk.totalSpace / 1e9).toFixed(1)} GB used</Badge>
        <Badge size="md" variant="dot">
          {used.toFixed(0)}%
        </Badge>
      </Group>

      <Progress value={used} mt={5} />

      <Group position="apart" mt="md">
        <Text fz="sm">20 / 36 km</Text>
        <Badge size="sm">4 days left</Badge>
      </Group>
    </Card>
  );
}
