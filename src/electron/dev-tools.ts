import { app } from "electron";
import * as fs from "fs";

export function electronReload(filesToWatch:string[]) {
  console.log("Watching for changes in: ", filesToWatch);
  const fileModificationTimes:{
    [key:string]:number
  } = {};

  filesToWatch.forEach(file => {
    fileModificationTimes[file] = getFileModificationTime(file);
  });

  setInterval(() => {
    filesToWatch.forEach(file => {
      const currentModificationTime = getFileModificationTime(file);
      if (currentModificationTime > fileModificationTimes[file]) {
        console.log(`Reloading due to change in: ${file}`);
        app.relaunch();
        app.quit();
      }
    });
  }, 1000);
}

function getFileModificationTime(file:string) {
  try {
    const stats = fs.statSync(file);
    return stats.mtimeMs;
  } catch (error:any) {
    console.error(`Error getting modification time for ${file}: ${error.message}`);
    return 0;
  }
}