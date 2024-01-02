import { isDev } from "../configs/config";
import {join} from 'path'

export function getUrl(suffix?: string) {
  if (isDev()) {
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