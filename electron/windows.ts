import { BrowserWindow, BrowserWindowConstructorOptions, app } from 'electron';
import { join } from 'path';

const isDev = !app.isPackaged;

function getUrl(suffix?: string) {
  if (isDev) {
    if (suffix) return `${process.argv[2]}/#/${suffix}`;
    return `${process.argv[2]}`;
  }
  let pathIndex = `./renderer/index.html`;
  if (suffix) {
    pathIndex = `${pathIndex}/#/${suffix}`;
  }
  const url = new URL(join('file:', __dirname, pathIndex));
  return url.href;
}

export function createMainWindow() {
  const opts: BrowserWindowConstructorOptions = {
    width: 800,
    height: 600,
    minWidth: 840,
    minHeight: 540,
    center: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
    frame: false,
    // windows右上角按钮
    titleBarOverlay: {
      color: '#00000000',
    },
    // macos左上角按钮
    titleBarStyle: 'hidden',
    // macos左上角按钮位置
    // trafficLightPosition: {
    //   x: 3,
    //   y: 5,
    // },
  };
  const win = new BrowserWindow(opts);
  win.loadURL(getUrl());
  return win;
}
