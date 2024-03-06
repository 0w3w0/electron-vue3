import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  testIPC: () => {
    ipcRenderer.send('test', 'ping');
    ipcRenderer.on('test', (event, arg) => {
      console.log(arg);  // prints "pong"
    });
  }
});
