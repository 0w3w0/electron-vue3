import {WindowIpcArgs, WindowIpcEvent} from "@common/ipc";
import {Subject} from "rxjs"
import {singleton} from "tsyringe";

export interface WindowEventType {
	type: WindowIpcEvent
	window: WindowIpcArgs
}

@singleton()
export class WindowEvent {
	private windowEvent = new Subject<WindowEventType>();

	//发布
	pub(event: WindowEventType) {
		this.windowEvent.next(event)
	}

	//订阅
	sub(callback: (event: WindowEventType) => void) {
		const $unsub = this.windowEvent.subscribe(callback)
		return () => {
			$unsub.unsubscribe()
		}
	}
}