/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  addColumnIfNotExists,
  connect,
  loadModels,
  updateAccountIdOfCategory,
  updateAccountIdOfDaybook,
  updatePinOfAccount,
} from './services/Database.service';
import IDaybook from '../types/IDaybook';
import {
  addDaybook,
  deleteDaybook,
  getAllDaybook,
  getDaybookByFilters,
  getLastTenDaybook,
  updateDaybook,
} from './services/Daybook.service';
import ICategory from '../types/ICategory';
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesByFilters,
  updateCategory,
} from './services/Category.service';
import { IAccount } from '../types';
import {
  addAccount,
  getAllAccounts,
  updateAccount,
} from './services/Account.service';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

connect();
loadModels();

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Migration

addColumnIfNotExists('Daybook', 'accountId');
addColumnIfNotExists('Category', 'accountId');
addColumnIfNotExists('Account', 'pin');

// Merry Christmas
updateAccountIdOfDaybook();
updateAccountIdOfCategory();
updatePinOfAccount();

// Daybook

ipcMain.handle('addDaybook', async (_, daybook: IDaybook) => {
  await addDaybook(daybook);
});

ipcMain.handle('getAllDaybook', async (_, accountId: number) => {
  return getAllDaybook(accountId);
});

ipcMain.handle('getLastTenDaybook', (_, accountId: number) => {
  return getLastTenDaybook(accountId);
});

ipcMain.handle(
  'getDaybookByFilters',
  (_, dateRange, entryType, categoryId, accountId) => {
    return getDaybookByFilters(dateRange, entryType, categoryId, accountId);
  },
);

ipcMain.handle('updateDaybook', (_, daybook: IDaybook) => {
  updateDaybook(daybook);
});

ipcMain.handle('deleteDaybook', (_, id: number) => {
  deleteDaybook(id);
});

// Category

ipcMain.handle('addCategory', async (_, category: ICategory) => {
  await addCategory(category);
});

ipcMain.handle('getAllCategories', (_, accountId: number) => {
  return getAllCategories(accountId);
});

ipcMain.handle(
  'getCategoriesByFilters',
  (_, entryType: string, accountId: number) => {
    return getCategoriesByFilters(entryType, accountId);
  },
);

ipcMain.handle('updateCategory', (_, category: ICategory) => {
  updateCategory(category);
});

ipcMain.handle('deleteCategory', (_, id: number) => {
  deleteCategory(id);
});

// Account

ipcMain.handle('addAccount', (_, account: IAccount) => {
  addAccount(account);
});

ipcMain.handle('getAllAccounts', () => {
  return getAllAccounts();
});

ipcMain.handle('updateAccount', (_, account: IAccount) => {
  updateAccount(account);
});

/*
  WRITTEN AND DIRECTED BY
    CHRISTOPHER NOLAN
*/

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
