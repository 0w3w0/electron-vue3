import { BrowserWindow } from "electron";
import { getUrl } from './helper'
import { WindowOptions } from "./options";
const windows = new Map<string, BrowserWindow>();

export const createWindow = (opts: WindowOptions) => {
  if (windows.has(opts.key)) {
    windows.get(opts.key)?.show()
    return windows.get(opts.key)
  }
  const win = new BrowserWindow(opts.options)
  windows.set(opts.key, win)
  win.loadURL(getUrl(opts.suffix))
  win.on('closed', () => {
    windows.delete(opts.key)
  })
  return win;
}