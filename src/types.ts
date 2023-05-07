interface Disk {
  name: string;
  mountPoint: String;
  totalSpace: number;
  availableSpace: number;
  isRemovable: boolean;
}

interface DiskRouteParams {
  name: string;
  path: string;
  used: number;
  isFullscan: boolean;
  isDirectory: boolean;
}

type TreeNode = {
  name: string;
  data: number;
  children: TreeNode[];
};

type DataStructure = {
  'schema-version': string;
  pdu: string;
  unit: string;
  tree: TreeNode;
};
