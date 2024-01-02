import {app} from "electron";

export const isDev = ()=>{
  return !app.isPackaged;
}