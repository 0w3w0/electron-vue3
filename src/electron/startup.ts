import { BrowserWindow, app } from 'electron';
import { mainWindowOptions } from "./windows/options";
import { createWindow } from "./windows";

let win: BrowserWindow | undefined;

function createMainWin() {
  win = createWindow(mainWindowOptions());
}
console.log('ddd')
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