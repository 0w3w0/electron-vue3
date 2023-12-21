import {app} from "electron";
import {singleton} from "tsyringe";

@singleton()
export class Configuration {

  constructor() {
  }

  get isDev() {
    return !app.isPackaged;
  }
}