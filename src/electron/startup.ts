import { BrowserWindow, app } from 'electron';
import { mainWindowOptions } from "./windows/options";
import { join } from "path";
import { electronReload } from "./dev-tools";
import { createWindow } from "./windows";
import { isDev } from "./configs/configuration";

let win: BrowserWindow | undefined;

function createMainWin() {
  win = createWindow(mainWindowOptions());
}

if (isDev()) {
  // 开发模式下热重载
  electronReload([join(__dirname,"startup.js")])
}

app.whenReady().then(() => {
  createMainWin();
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWin()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})