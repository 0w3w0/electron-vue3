import { BrowserWindow } from "electron";
import { join } from "path";
import { WindowOptions } from "./options";
import { Configuration } from "../configs/configuration";
import { injectable } from "tsyringe";

@injectable()
export class WindowManager {

  windows = new Map<string, BrowserWindow>();

  constructor(
    private config: Configuration
  ) { }

  createWindow(opts: WindowOptions) {
    if (this.windows.has(opts.key)) {
      this.windows.get(opts.key)?.show()
      return this.windows.get(opts.key)
    }
    const win = new BrowserWindow(opts.options)
    this.windows.set(opts.key, win)
    win.loadURL(this.getUrl(opts.suffix))
    win.on('closed', () => {
      this.windows.delete(opts.key)
    })
    return win;
  }

  getWindow(key: string) {
    return this.windows.get(key)
  }

  private getUrl(suffix?: string) {
    if (this.config.IsDevEnv) {
      if (suffix) return `${process.argv[2]}/#/${suffix}`
      return `${process.argv[2]}`;
    }
    let pathIndex = `./renderer/index.html`
    if (suffix) {
      pathIndex = `${pathIndex}/#/${suffix}`
    }
    const url = new URL(join('file:', __dirname, pathIndex));
    return url.href
  }

}