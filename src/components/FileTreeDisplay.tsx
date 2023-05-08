import { Stack, Title, NavLink, Text, ScrollArea, Group, Badge, Flex, Container } from '@mantine/core';
import { IconFolder, IconFile } from '@tabler/icons-react';
import { formatBytes, parseDataStructure } from '../tools/parsing';
import { TreeNode } from '../types';

export function FileTreeDisplay({ status, name }: { status: any; name: string }) {
  const data = parseDataStructure(status);
  console.log(status);
  const renderTreeNodes = (nodes: TreeNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <NavLink
        icon={node.children.length > 0 ? <IconFolder /> : <IconFile />}
        key={node.name}
        disableRightSectionRotation
        rightSection={
          <Badge color="blue" variant="light" size="xs">
            {formatBytes(node.data)}
          </Badge>
        }
        label={<Group spacing={'xs'}>{node.name}</Group>}
      >
        {node.children.length > 0 && renderTreeNodes(node.children)}
      </NavLink>
    ));
  };

  return (
    <Stack style={{ height: '90vh' }}>
      <Title>Disk: {name}</Title>
      <ScrollArea
        style={{
          height: '100vh',
        }}
      >
        {renderTreeNodes(data.tree.children)}
      </ScrollArea>
    </Stack>
  );
}
