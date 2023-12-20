import {BrowserWindowConstructorOptions} from "electron"

export interface WindowOptions {
	key: string
	options: BrowserWindowConstructorOptions
	suffix?: string
}

export const mainWindowOptions = (): WindowOptions => {
	const opts:BrowserWindowConstructorOptions = {
		width: 800,
		height: 600,
		minWidth: 840,
		minHeight: 540,
		center: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		frame: false,
		titleBarStyle: "hidden",
		trafficLightPosition: {
			x: 3,
			y: 5
		}
	}
	return {
		key: "main",
		options: opts,
	}
}