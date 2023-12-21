import "reflect-metadata"

import { BrowserWindow, app } from 'electron';
import { container, injectable } from "tsyringe";
import { WindowManager } from "./windows";
import { mainWindowOptions } from "./windows/options";
import { Configuration } from "./configs/configuration";
import { join } from "path";
import { electronReload } from "./dev-tools";
@injectable()
export class Startup {
  win: BrowserWindow | undefined;

  constructor(
    private readonly windows: WindowManager,
    private readonly config: Configuration,
  ) {
  }


  init() {
    if (this.config.isDev) {
      // 开发模式下热重载
      electronReload([join(__dirname,"startup.js")])
    }
    this.window();
  }

  createMainWin() {
    this.win = this.windows.createWindow(mainWindowOptions());
  }

  window() {
    app.whenReady().then(() => {
      this.createMainWin();
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWin()
      }
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    })
  }
}

const startup = container.resolve(Startup);
startup.init();
