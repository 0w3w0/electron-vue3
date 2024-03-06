import { Plugin, ViteDevServer } from 'vite';
import { build } from 'esbuild';
import { exec, ChildProcess } from 'child_process';
import { spawn } from 'cross-spawn';
import * as os from 'os';
import * as fs from 'fs';

export interface PluginOptions {
  main: {
    entryPoints: string[];
    outfile: string;
  };
  preload?: {
    entryPoints: string[];
    outfile: string;
  };
  externals?: string[];
  plugins?: any[];
}

export let electron = (opts: PluginOptions): Plugin[] => {
  return [devServer(opts), prodBuild(opts)];
};

const runElectron = (outfile: string, url: string): ChildProcess => {
  return spawn('electron', [outfile, url], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
};

const killElectronProcess = (electronProcess: ChildProcess | null) => {
  if (!electronProcess) return;
  if (os.platform() === 'win32') {
    exec(`taskkill /pid ${electronProcess.pid} /f /t`, (error) => {
      if (error) {
        console.error('Failed to kill process:', error);
      }
    });
  } else {
    electronProcess.kill();
  }
};

const buildEntryPoints = async (opts: PluginOptions) => {
  await build({
    entryPoints: opts.main.entryPoints,
    bundle: true,
    platform: 'node',
    outfile: opts.main.outfile,
    external: opts?.externals, // 排除打包的模块
    plugins: opts?.plugins,
  });
};

const buildPreloads = async (opts: PluginOptions) => {
  if (!opts.preload) return;
  await build({
    entryPoints: opts.preload.entryPoints,
    bundle: true,
    platform: 'node',
    outfile: opts.preload.outfile,
    external: opts?.externals, // 排除打包的模块
    plugins: opts?.plugins,
  });
};

const devServer = (opts: PluginOptions): Plugin => {
  let electronProcess: ChildProcess;
  let server: ViteDevServer;
  let url = '';
  const startFunc = () => {
    if (!server.httpServer) return;
    const httpServer = server.httpServer;
    httpServer.once('listening', () => {
      const localhosts = [
        'localhost',
        '127.0.0.1',
        '::1',
        '0000:0000:0000:0000:0000:0000:0000:0001',
      ];
      const address = server.httpServer?.address();
      if (!address || typeof address === 'string') {
        console.error('Unexpected dev server address', address);
        process.exit(1);
      }
      const protocol = server.config.server.https ? 'https' : 'http';
      const host = localhosts.includes(address.address)
        ? 'localhost'
        : address.address;
      const port = address.port;
      // 判断是否是electron启动
      if (process.env.ELECTRON_START_URL) return;
      url = `${protocol}://${host}:${port}`;
      electronProcess = runElectron(opts.main.outfile, url);
    });
    httpServer.once('close', () => {
      console.log('httpServer close');
      electronProcess?.kill();
    });
    httpServer.on('error', () => {
      console.log('httpServer error');
      electronProcess?.kill();
    });
  };

  return {
    name: 'electron-dev-server',
    apply: 'serve',
    async configureServer(app: ViteDevServer) {
      server = app;
      await buildPreloads(opts);
      await buildEntryPoints(opts);
      startFunc();
    },
    watchChange: async (id) => {
      if (!id.startsWith(process.cwd() + '/electron')) return;
      await buildPreloads(opts);
      await buildEntryPoints(opts);
      killElectronProcess(electronProcess);
      electronProcess = runElectron(opts.main.outfile, url);
    },
  };
};

const prodBuild = (opts: PluginOptions): Plugin => {
  return {
    name: 'electron-prod-build',
    apply: 'build',
    buildEnd: async () => {
      await buildPreloads(opts);
      await buildEntryPoints(opts);
    },
  };
};
