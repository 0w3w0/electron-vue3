import { BrowserWindow, app } from "electron";
import { WindowManager } from "./windows";
import { mainWindowOptions } from "./windows/options";
import { injectable } from "tsyringe";

@injectable()
export class App {
  win: BrowserWindow | undefined;

  constructor(
    private readonly windowManager: WindowManager,
  ){}

  run() {
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

  private createMainWin() {
    this.win = this.windowManager.createWindow(mainWindowOptions());
  }
}