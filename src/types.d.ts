export interface Disk {
  name: string;
  mountPoint: String;
  totalSpace: number;
  availableSpace: number;
  isRemovable: boolean;
}

export interface DiskRouteParams {
  name: string;
  path: string;
  used: number;
  isFullscan: boolean;
  isDirectory: boolean;
}

export type TreeNode = {
  name: string;
  data: number;
  children: TreeNode[];
};

export type DataStructure = {
  'schema-version': string;
  pdu: string;
  unit: string;
  tree: TreeNode;
};
