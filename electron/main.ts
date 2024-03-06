import 'reflect-metadata';
import { BrowserWindow, app } from 'electron';
import * as os from 'os';
import { createMainWindow } from './windows';
import { initIPC } from './ipc';
let mainWindow: BrowserWindow | null;

function createWin() {
  mainWindow = createMainWindow();
}



app.whenReady().then(() => {
  initIPC();
  createWin()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWin()
  }
})

app.on('window-all-closed', () => {
  if (os.platform() !== 'darwin') {
    app.quit();
  }
})
