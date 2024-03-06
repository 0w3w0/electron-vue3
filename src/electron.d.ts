export interface IElectronAPI {
  testIPC: () => Promise<void>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}