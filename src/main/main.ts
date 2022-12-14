/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'node:path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import process from 'process';
import { exec } from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

function setConfig(key: string, value: string) {
  const configJsonPath = path.join(app.getPath('userData'), 'config.json');

  let oldConfig = {};
  if (fs.existsSync(configJsonPath)) {
    oldConfig = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
  }

  fs.writeFileSync(
    path.join(app.getPath('userData'), 'config.json'),
    JSON.stringify({
      ...oldConfig,
      [key]: value,
    })
  );

  console.log('configJsonPath', configJsonPath);
  console.log('setConfig', key, value);
}

function getConfig(key: string) {
  const configJsonPath = path.join(app.getPath('userData'), 'config.json');

  let oldConfig = {} as {
    [key: string]: string;
  };
  console.log('----------------------------------------');
  console.log(fs.readFileSync(configJsonPath).toString());
  console.log('----------------------------------------');

  if (fs.existsSync(configJsonPath)) {
    oldConfig = JSON.parse(fs.readFileSync(configJsonPath).toString());
  }

  return oldConfig[key];
}

const packageJsonPath = process.argv[1] || '';

const basename = path.basename(packageJsonPath);

const packageJsonInfo = {
  name: 'welcome',
  version: '',
  scripts: [] as string[],
  withoutParams: true,
};

if (basename.endsWith('.json') && basename !== 'package.json') {
  const executor = getConfig('json-opener');

  if (executor) {
    // const cmd = `start cmd.exe @cmd /k ""${executor}" "${packageJsonPath}""`;
    const cmd = `"${executor}" "${packageJsonPath}"`;
    console.log(cmd);
    exec(
      cmd,
      {
        cwd: path.dirname(packageJsonPath),
      },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
        }
        console.log(stdout);
        console.log(stderr);
      }
    );

    app.quit();
  } else {
    packageJsonInfo.name = 'need config json-opener';
  }
}

if (basename === 'package.json') {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const { name, version, scripts } = packageJson;
  packageJsonInfo.name = name;
  packageJsonInfo.version = version;

  if (!name) {
    packageJsonInfo.name = '/';
  }
  if (!version) {
    packageJsonInfo.version = '0.0.0';
  }
  if (!scripts) {
    packageJsonInfo.scripts = [];
  } else {
    packageJsonInfo.scripts = Object.keys(scripts);
  }

  packageJsonInfo.withoutParams = false;

  console.log('packageJsonInfo', packageJsonInfo);
}

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('package-json-info', async (event, arg) => {
  event.reply('package-json-info', packageJsonInfo);
});

ipcMain.on('settings', async (event, arg) => {
  console.log('settings', arg);
  event.reply('settings', {
    'json-opener': getConfig('json-opener') || '',
    'cmd-execute-template': getConfig('cmd-execute-template') || '',
  });
});

ipcMain.on('set-setting', async (event, [{ type: arg, value }]) => {
  console.log(arg);
  if (arg === 'json-opener') {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
    });

    if (filePaths.length > 0) {
      setConfig(arg, filePaths[0]);
    }
  }
  if (arg === 'cmd-execute-template') {
    setConfig(arg, value);
  }

  event.reply('settings', {
    'json-opener': getConfig('json-opener') || '',
    'cmd-execute-template': getConfig('cmd-execute-template') || '',
  });
});

ipcMain.on('execute', async (event, [arg]) => {
  console.log(arg);

  let cmdExecutor = getConfig('cmd-execute-template');
  if (!cmdExecutor) {
    cmdExecutor = 'start cmd.exe @cmd /k {pjocmd}';
  }

  exec(
    cmdExecutor.replace('{pjocmd}', arg),
    {
      cwd: path.dirname(packageJsonPath),
    },
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(stdout);
    }
  );
});

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
      forceDownload
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
    width: 400,
    height: 600,
    frame: !!isDebug,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
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
