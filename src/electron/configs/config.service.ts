import {app} from "electron";
import {singleton} from "tsyringe";

@singleton()
export class ConfigService {

	constructor() {
	}

	get isDev() {
		return !app.isPackaged;
	}
}