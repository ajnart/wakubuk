interface Disk {
  name: string;
  mountPoint: String;
  totalSpace: number;
  availableSpace: number;
  isRemovable: bool;
}

interface DiskRouteParams {
  name: string;
  path: string,
  used: number;
  isFullscan: boolean;
  isDirectory: boolean;
}
