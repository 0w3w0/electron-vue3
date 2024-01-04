import { BrowserWindowConstructorOptions } from "electron"

export interface WindowOptions {
  /**
   * 窗口唯一标识
   */
  key: string
  options: BrowserWindowConstructorOptions
  /**
   * 前端使用路由时(hash路由)，需要指定前端路由的path
   * 例如：http://localhost:3000/#/home, 则suffix为home
   */
  suffix?: string
}

export const mainWindowOptions = (): WindowOptions => {
  const opts: BrowserWindowConstructorOptions = {
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