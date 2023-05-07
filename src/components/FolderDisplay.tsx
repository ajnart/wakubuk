import { createStyles, Text, Card, RingProgress, Group, rem, Badge, Code, Title, Stack, Avatar } from '@mantine/core';
import { IconDatabase, IconFolder, IconServer } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { open } from '@tauri-apps/api/dialog';

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

export function FolderDisplay() {
  const navigate = useNavigate();

  function OpenFolder() {
    open({
      multiple: false,
      directory: true,
    }).then((directory) => {
			console.log({ directory });

      if (directory)
        navigate('/analyze', {
          state: {
            name: (directory as string).replace(/^.*[\\\/]/, ''),
						path: (directory as string).replace(/\\/g, '/'),
            used: 0,
            fullscan: false,
            isDirectory: true,
          },
        });
      console.log({ directory });
    });
  }

  const { classes, theme } = useStyles();
  return (
    <Card withBorder shadow="md" p="xl" radius="md" className={classes.card} onClick={() => OpenFolder()}>
      <div className={classes.inner}>
        <Stack spacing={'lg'}>
          <Group spacing="xs">
            <Avatar size={'md'} color={'blue'} variant="light" radius={'xl'}>
              <IconFolder size={24} />
            </Avatar>
            <Title order={2}>Select a folder</Title>
          </Group>
          <Stack spacing="xs">
            <Text className={classes.label}>Select any folder on your computer to be analyzed</Text>
            <Text size="md" color="dimmed">
              You can even drag and drop a folder onto the app!
            </Text>
          </Stack>
        </Stack>
      </div>
    </Card>
  );
}
