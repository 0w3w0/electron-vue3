import { ipcMain } from "electron";

export function initIPC(){
  ipcMain.on('test', (event, arg) => {
    console.log(arg);  // prints "ping"
    event.reply('test', 'pong');
  });
}