import { createContext } from "react";

export type folder = {
  id: string;
  folderName: string;
  createdAt: string;
  files: [];
  parentId: string;
  children: [];
  path: [];
};

export const InitialFolder: folder = {
  id: "",
  folderName: "",
  createdAt: "",
  files: [],
  parentId: "",
  children: [],
  path: [],
};

export type FolderPayload = {
  folderName: string;
  parentId: string;
};

export type FolderContextProps = {
  folder: folder;
  createFolder: () => Promise<void>;
};

export const FolderContext = createContext<FolderContextProps>({
  folder: InitialFolder,
  createFolder: async () => {},
});
