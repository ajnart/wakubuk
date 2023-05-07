import { Stack, Title, NavLink, Text } from '@mantine/core';
import { IconFolder, IconFile } from '@tabler/icons-react';
import { parseDataStructure } from '../tools/parsing';
import { TreeNode } from '../types';

export function FileTreeDisplay({ status, name }: { status: any; name: string }) {
  const data = parseDataStructure(status);
  console.log({ data });
  const renderTreeNodes = (nodes: TreeNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <NavLink icon={node.children.length > 0 ? <IconFolder /> : <IconFile />} key={node.name} label={node.name}>
        {node.children.length > 0 && renderTreeNodes(node.children)}
      </NavLink>
    ));
  };

  return (
    <Stack style={{ height: '90vh' }}>
      <Title>Disk: {name}</Title>
      {renderTreeNodes(data.tree.children)}
    </Stack>
  );
}
