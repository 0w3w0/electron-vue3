import { Plugin, ViteDevServer } from "vite";
import { build } from "esbuild";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

export interface PluginOptions {
	entryPoints: string[],
	externals?: string[],
	plugins?: any[],
	outfile: string,
}

export let electron = (opts: PluginOptions): Plugin[] => {
	return [devServer(opts), prodBuild(opts)]
};

const runElectron = (outfile:string,url: string): ChildProcess => {
	return spawn("electron", [outfile, url], {
		cwd: process.cwd(),
		stdio: "inherit",
	});
}

const buildFunc = async (opts:PluginOptions) => {
	await build({
		entryPoints: opts.entryPoints,
		bundle: true,
		platform: "node",
		outfile: opts.outfile,
		external: opts?.externals,// 排除打包的模块
		plugins: opts?.plugins,
	});
}

const devServer = (opts:PluginOptions):Plugin=>{
	let electronProcess: ChildProcess;
	let server: ViteDevServer;
	let url = '';
	const startFunc = () => {
		if (!server.httpServer) return;
		const httpServer = server.httpServer;
		httpServer.once('listening', () => {
			const localhosts = [
				"localhost",
				"127.0.0.1",
				"::1",
				"0000:0000:0000:0000:0000:0000:0000:0001",
			];
			const address = server.httpServer?.address();
			if (!address || typeof address === "string") {
				console.error("Unexpected dev server address", address);
				process.exit(1);
			}
			const protocol = server.config.server.https ? "https" : "http";
			const host = localhosts.includes(address.address)
				? "localhost"
				: address.address;
			const port = address.port;
			// 判断是否是electron启动
			if (process.env.ELECTRON_START_URL) return;
			url = `${protocol}://${host}:${port}`
			electronProcess = runElectron(opts.outfile, url);
		});
		httpServer.once('close', () => {
			console.log("httpServer close")
			electronProcess?.kill();
		})
		httpServer.on('error', () => {
			console.log("httpServer error")
			electronProcess?.kill();
		})
	}
	return  {
		name: "electron-dev-server",
		apply: 'serve',
		async configureServer(app: ViteDevServer) {
			server = app;
			await buildFunc(opts);
			startFunc();
		},
		async watchChange(id) {
			if (!id.startsWith(process.cwd() + "/src/electron")) return;
			await buildFunc(opts);
			electronProcess?.kill();
			electronProcess = runElectron(opts.outfile,url);
		}
	}
}

const prodBuild = (opts:PluginOptions):Plugin=>{
	return {
		name: "electron-prod-build",
		apply: 'build',
		async buildEnd() {
			await buildFunc(opts)
		}
	}
}





