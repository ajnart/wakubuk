import { Stack, Title, NavLink, Text, ScrollArea, Group, Badge, Flex, Container, Menu } from '@mantine/core';
import { IconFolder, IconFile, IconExternalLink } from '@tabler/icons-react';
import { formatBytes, parseDataStructure } from '../tools/parsing';
import { DataStructure, TreeNode } from '../types';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';

export function FileTreeDisplay({ data, name }: { data: DataStructure; name: string }) {
  const renderTreeNodes = (nodes: TreeNode[], currentPath: string): React.ReactNode => {
    return nodes.map((node) => (
      <NavLink
        onContextMenuCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          invoke('open_folder', { path: `${currentPath}/${node.name}`, inside: true });
        }}
        icon={node.children.length > 0 ? <IconFolder /> : <IconFile />}
        key={node.name}
        disableRightSectionRotation
        rightSection={
          <Badge color="blue" variant="outline" size="sm">
            {formatBytes(node.data)}
          </Badge>
        }
        label={<Group spacing={'xs'}>{node.name}</Group>}
      >
        {node.children.length > 0 && renderTreeNodes(node.children, `${currentPath}/${node.name}`)}
      </NavLink>
    ));
  };

  return (
    <ScrollArea
      style={{
        height: '80vh',
      }}
    >
      {renderTreeNodes(data.tree.children, data.tree.name)}
    </ScrollArea>
  );
}
