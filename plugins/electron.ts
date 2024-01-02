import { Plugin, ViteDevServer } from "vite";
import { build } from "esbuild";
import { spawn, ChildProcess } from "child_process";

export let electron = (opts: {
	entryPoints: string[],
	externals?: string[],
	plugins?: any[],
	outfile?: string,
}): Plugin => {
	let server: ViteDevServer;
	const outfile = opts.outfile || "./dist/startup.js";
	const buildFunc = async () => {
		await build({
			entryPoints: opts.entryPoints,
			bundle: true,
			platform: "node",
			outfile: outfile,
			external: opts?.externals,// 排除打包的模块
			plugins: opts?.plugins,
		});
	}
	let electronProcess: ChildProcess;
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
			electronProcess = runElectron(outfile, url);
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
	return {
		name: "electron-plugin",
		async configureServer(app: ViteDevServer) {
			server = app;
			await buildFunc();
			startFunc();
		},
		async buildEnd() {
			await buildFunc()
		},
		async watchChange(id) {
			if (!id.startsWith(process.cwd() + "/src/electron")) return;
			await buildFunc();
			electronProcess?.kill();
			electronProcess = runElectron(outfile,url);
		}
	};
};

const runElectron = (outfile:string,url: string): ChildProcess => {
	return spawn("electron", [outfile, url], {
		cwd: process.cwd(),
		stdio: "inherit",
	});
}

