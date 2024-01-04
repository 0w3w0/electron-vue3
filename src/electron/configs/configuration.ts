import {app} from "electron";
import { singleton } from "tsyringe";

@singleton()
export class Configuration {
  get IsDevEnv() {
    return !app.isPackaged;
  }
}