export class BaseResult {
	code = "OK";

	constructor(code?: string) {
		if (code) {
			this.code = code;
		}
	}

	get ok() {
		return this.code === "OK";
	}
}

export class IpcResult<T = any> extends BaseResult {
	data?: T;
	message?: string;

	constructor(code: string, options?: { data?: T, message?: string }) {
		super(code);
		if (options) {
			this.data = options.data;
			this.message = options.message;
		}
	}

	static from(result: any) {
		if (Reflect.has(result, "code")) {
			return new IpcResult(result.code, result);
		} else {
			return new IpcResult("ERROR", {message: "Invalid Ipc result"})
		}
	}
}