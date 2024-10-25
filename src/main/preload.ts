// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import IDaybook from '../types/IDaybook';
import ICategory from '../types/ICategory';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  // Daybook

  addDaybook: (daybook: IDaybook) => ipcRenderer.invoke('addDaybook', daybook),
  getAllDaybook: () => ipcRenderer.invoke('getAllDaybook'),
  getLastTenDaybook: () => ipcRenderer.invoke('getLastTenDaybook'),
  getDaybookByFilters: (
    dateRange: Array<string> | null,
    entryType: string,
    categoryId: string,
  ) =>
    ipcRenderer.invoke('getDaybookByFilters', dateRange, entryType, categoryId),
  updateDaybook: (daybook: IDaybook) =>
    ipcRenderer.invoke('updateDaybook', daybook),
  deleteDaybook: (id: number) => ipcRenderer.invoke('deleteDaybook', id),

  // Category

  addCategory: (category: ICategory) =>
    ipcRenderer.invoke('addCategory', category),
  getAllCategories: () => ipcRenderer.invoke('getAllCategories'),
  updateCategory: (category: ICategory) =>
    ipcRenderer.invoke('updateCategory', category),
  deleteCategory: (id: number) => ipcRenderer.invoke('deleteCategory', id),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
