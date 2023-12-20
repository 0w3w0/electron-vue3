export class Exception extends Error {
	code: any;

	constructor(code: any, message: string) {
		super(message);
		this.code = code;
	}
}