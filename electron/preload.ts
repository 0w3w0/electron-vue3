import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  testIPC: () => {
    ipcRenderer.send('test', 'ping');
    console.log('ping');
  }
});
