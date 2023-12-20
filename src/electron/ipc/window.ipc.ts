import {ipcMain} from "electron"
import {injectable} from "tsyringe"
import {WindowEvent} from "@electron/event"
import {WindowIpcArgs, WindowIpcEvent} from "@common/ipc"

@injectable()
export class WindowIpcService {
	constructor(
		private windowEvent: WindowEvent
	) {
	}

	init() {
		this.open()
	}

	private open() {
		ipcMain.on(WindowIpcEvent.OPEN, (_, args: WindowIpcArgs) => {
			this.windowEvent.pub({
				type: WindowIpcEvent.OPEN,
				window: args
			})
		})
	}
}