import { BrowserWindow } from 'electron';
import { injectable } from 'tsyringe';
import { WindowOptions } from './options';
import { ConfigService } from '@electron/configs/config.service';
import { join } from 'path'
@injectable()
export class WindowService {
	private _windows: Map<string, BrowserWindow> = new Map();

	constructor(
		private config: ConfigService
	) {
	}

	getUrl(sufix?: string) {
		console.log(this.config.isDev)
		if (this.config.isDev) {
			if (sufix) return `${process.argv[2]}/#/${sufix}`
			return `${process.argv[2]}`;
		}
		let pathIndex = `./renderer/index.html`
		if (sufix) {
			pathIndex = `${pathIndex}/#/${sufix}`
		}
		const url = new URL(join('file:', __dirname, pathIndex));
		return url.href
	}

	createWindow(opts: WindowOptions) {
		if (this._windows.has(opts.key)) {
			this._windows.get(opts.key)?.show()
			return this._windows.get(opts.key)
		}
		const win = new BrowserWindow(opts.options)
		this._windows.set(opts.key, win)
		win.loadURL(this.getUrl(opts.suffix))
		win.on('closed', () => {
			this._windows.delete(opts.key)
		})
		return win;
	}
}