interface BaseError {
	code: number;
}

/**
 * 图片类型错误
 */
export class ImageTypeError extends Error implements BaseError {
	constructor(target: string, accept: string[]) {
		const msg = `Unsupported image type: ${target}, please choose the following format: ${accept.join(', ')}`;
		super(msg);
		this.name = 'ImageTypeError';
		this.target = target;
		this.accept = accept;
	}

	get code() {
		return 0;
	}

	readonly target;

	readonly accept;
}

/**
 * 图片文件过大
 */
export class TmageFileTooLarge extends Error implements BaseError {
	constructor(actual: number, target: number) {
		const msg = `Image too large: ${actual}KB, please choose a size smaller than ${target}KB`;
		super(msg);
		this.name = 'TmageTooLarge';
		this.actual = actual;
		this.target = target;
	}

	get code() {
		return 1;
	}

	readonly actual;
	readonly target;
}

/**
 * 图片尺寸过小
 */
export class ImageDimensionsTooSmall extends Error implements BaseError {
	constructor(w: number, h: number, target: number) {
		const msg = `Image too small: ${w}x${h}, please choose a size larger than ${target}x${target}`;
		super(msg);
		this.name = 'ImageDimensionsTooSmall';

		this.w = w;
		this.h = h;
		this.target = target;
	}

	get code() {
		return 2;
	}

	readonly w;
	readonly h;
	readonly target;
}
