import {
  app,
  BaseWindow,
  BrowserWindow,
  dialog,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import * as fs from "fs";
import { IPCEvents } from "../events";
import ElectronLog from "electron-log";
import { IS_MAC } from "./utils";
import { GRAAL_DUMP_EXTENSIONS } from "../lib/constants";
import * as path from "path";

const macMenu: MenuItemConstructorOptions = {
  label: app.name,
  role: "appMenu",
};

export function openFileChooser(browserWindow: Option<BaseWindow>): void {
  if (!browserWindow || !(browserWindow instanceof BrowserWindow)) {
    ElectronLog.error(
      "'Open BGV File' menu opened without an attached browser window."
    );
    return;
  }

  dialog
    .showOpenDialog(browserWindow, {
      filters: [
        {
          name: "Graal Dump File",
          extensions: GRAAL_DUMP_EXTENSIONS.map((ext) => ext.replace(".", "")),
        },
      ],
      properties: ["openFile", "dontAddToRecent"],
    })
    .then((result) => {
      if (!result.canceled) {
        const filePath = result.filePaths[0];
        const directory = path.dirname(filePath);
        const filename = path.basename(filePath);

        browserWindow.webContents.send(IPCEvents.DirectoryLoaded, {
          directoryName: directory,
          files: [filename],
        });
      }
    });
}

export function openDirectoryChooser(browserWindow: Option<BaseWindow>): void {
  if (!browserWindow || !(browserWindow instanceof BrowserWindow)) {
    ElectronLog.error(
      "'Open BGV Directory' menu opened without an attached browser window."
    );
    return;
  }

  dialog
    .showOpenDialog(browserWindow, {
      properties: ["openDirectory", "dontAddToRecent"],
    })
    .then((result) => {
      if (!result.canceled) {
        const directory = result.filePaths[0];

        fs.readdir(directory, async (err, files) => {
          if (err) {
            ElectronLog.error(err);
          } else {
            const dumpFiles = files.filter((file) =>
              GRAAL_DUMP_EXTENSIONS.some((ext) => file.endsWith(ext))
            );

            browserWindow.webContents.send(IPCEvents.DirectoryLoaded, {
              directoryName: directory,
              files: dumpFiles,
            });
          }
        });
      }
    });
}

const primaryMenu: MenuItemConstructorOptions = {
  label: "File",
  submenu: [
    {
      label: "Open BGV File",
      click: (_menuItem, browserWindow, _event) => {
        openFileChooser(browserWindow);
      },
    },
    {
      label: "Open BGV Directory",
      click: (_menuItem, browserWindow, _event) => {
        openDirectoryChooser(browserWindow);
      },
    },
  ],
};

const menu = IS_MAC ? [macMenu, primaryMenu] : [primaryMenu];

export const applicationMenu = Menu.buildFromTemplate(menu);
