import "reflect-metadata"

import {BrowserWindow, app} from 'electron';
import {container, injectable} from "tsyringe";
import {WindowService} from "./windows";
import { mainWindowOptions } from "./windows/options";

@injectable()
export class Startup {
	win: BrowserWindow | undefined;

	constructor(
		private readonly windowSrv: WindowService,
	) {
	}

	init() {
		this.window();
	}

	createMainWin() {
		this.win = this.windowSrv.createWindow(mainWindowOptions());
	}

	window() {
		app.whenReady().then(() => {
			this.createMainWin();
		})

		app.on('activate', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				this.createMainWin()
			}
		})

		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		})
	}
}

const startup = container.resolve(Startup);
startup.init();