import { Plugin, PluginOption, ViteDevServer } from "vite";
import { build } from "esbuild";
import { spawn, ChildProcess } from "child_process";

export let electronPlugin = (opts: {
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
			outfile:outfile,
			external: opts?.externals,// 排除打包的模块
			plugins: opts?.plugins,
		});
	}
	return {
		name: "electron-plugin",
		async configureServer(app: ViteDevServer) {
			server = app;
			await buildFunc();
			if (!server.httpServer) return;
			const httpServer = server.httpServer;
			let electronProcess: ChildProcess;
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
				electronProcess = spawn("electron", [outfile, `${protocol}://${host}:${port}`], {
					cwd: process.cwd(),
					stdio: "inherit",
				});
				electronProcess.on("close", () => {
					server.close();
					process.exit(1);
				});
			});
			httpServer.once('close', () => {
				console.log("httpServer close")
				electronProcess?.kill();
			})
			httpServer.on('error', () => {
				console.log("httpServer error")
				electronProcess?.kill();
			})
		},
		async buildEnd() {
			await buildFunc()
		}
	};
};

export let getReplacer = (options?: {
	electronModules?: string[]
	externalsModules?: string[]
}) => {
	if (!options) options = {};
	let result = {};
	if (options.externalsModules) {
		// let externalModels = ["os", "fs", "path"];
		for (let item of options.externalsModules) {
			result[item] = () => ({
				find: new RegExp(`^${item}$`),
				code: `const ${item} = require('${item}');export { ${item} as default }`,
			});
		}
	}
	if (options.electronModules) {
		let electronModules = options.electronModules.join(",");
		result["electron"] = () => {
			// let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
			return {
				find: new RegExp(`^electron$`),
				code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
			};
		};
	}

	return result;
};