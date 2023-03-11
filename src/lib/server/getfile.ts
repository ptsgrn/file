/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import jimp from 'jimp';

export class ImageManipulationError extends Error {
	constructor(processName: string, error) {
		super(error.message);
		this.name = 'ImageManipulationError';
		this.message = `Error while processing ${processName}: ${error.message}`;
	}
}

export class ImageManipulation {
	private image: Promise<jimp>;
	private filetype:
		| typeof jimp.MIME_JPEG
		| typeof jimp.MIME_PNG
		| typeof jimp.MIME_BMP
		| typeof jimp.MIME_TIFF
		| typeof jimp.MIME_GIF
		| typeof jimp.MIME_X_MS_BMP;
	private processes: string[];
	constructor(
		imageBuffer: Buffer,
		filetype:
			| typeof jimp.MIME_JPEG
			| typeof jimp.MIME_PNG
			| typeof jimp.MIME_BMP
			| typeof jimp.MIME_TIFF
			| typeof jimp.MIME_GIF
			| typeof jimp.MIME_X_MS_BMP,
		query: URLSearchParams
	) {
		this.image = jimp.read(imageBuffer);
		this.filetype = filetype;
		// example: ?crop=0,0,100,100&resize=100,auto&rotate=90
		// to: Map(3) { 'crop' => [ '0', '0', '100', '100' ], 'resize' => [ '100', 'auto' ], 'rotate' => [ '90' ] }
		this.processes = Array.from(query.entries())
			.map(([name]) => name)
			.filter((name) => this.processGenerator[name]);
		const processes = Array.from(query.entries())
			.map(([name, args]) => {
				const processer = this.processGenerator[name];
				if (!processer) return null;
				return processer(
					...args.split(',').map((arg) => {
						if (arg === 'auto') return arg;
						if (arg === 'true' || arg === 'false') return arg === 'true';
						return Number(arg);
					})
				);
			})
			.filter((process) => process !== null);

		// @ts-ignore
		this.chainProcess(processes);
	}

	get processGenerator(): Record<string, (...args: Array<unknown>) => () => Promise<jimp>> {
		return {
			crop: (x: number, y: number, width: number, height: number) => () =>
				this.crop(x, y, width, height),
			resize: (w: number | 'auto', h: number | 'auto') => () => this.resize({ w, h }),
			rotate: (deg: number, mode: boolean) => () => this.rotate(deg, mode),
			contain: (w: number, h: number) => () => this.contain({ w, h }),
			cover: (w: number, h: number) => () => this.cover({ w, h }),
			scale: (f: number) => () => this.scale({ f }),
			scaleToFit: (w: number, h: number) => () => this.scaleToFit({ w, h }),
			autocrop: (tolerance: number, frames: boolean) => () => this.autocrop(tolerance, frames),
			// mask: (src: jimp, x: number, y: number) => () => this.mask(src, x, y),
			convolute: (kernel: number[][]) => () => this.convolute(kernel),
			gaussian: (r: number) => () => this.gaussian(r),
			invert: () => () => this.invert(),
			opacity: (f: number) => () => this.opacity(f),
			posterize: (n: number) => () => this.posterize(n),
			sepia: () => () => this.sepia(),
			brightness: (f: number) => () => this.brightness(f),
			contrast: (f: number) => () => this.contrast(f),
			fade: (f: number) => () => this.fade(f),
			greyscale: () => () => this.greyscale(),
			normalize: () => () => this.normalize(),
			dither565: () => () => this.dither565()
		};
	}

	async getBuffer() {
		const image = await this.image;
		return image.getBufferAsync(jimp.MIME_JPEG);
	}

	async chainProcess(processes: Array<() => Promise<jimp>>) {
		for (let i = 0; i < processes.length; i++) {
			const process = processes[i];
			this.image = process().catch((error) => {
				throw new ImageManipulationError(this.processes[i], error);
			});
		}
	}

	//#region RESIZE
	async contain({ w, h }: { w: number; h: number }): Promise<jimp> {
		const image = await this.image;
		return image.contain(w, h);
	}

	async cover({ w, h }: { w: number; h: number }): Promise<jimp> {
		const image = await this.image;
		return image.cover(w, h);
	}

	async resize({ w, h }: { w: number | 'auto'; h: number | 'auto' }): Promise<jimp> {
		if (w === 'auto' && h === 'auto') throw new Error('w and h cannot be auto at the same time');
		if (w === 'auto') w = jimp.AUTO;
		if (h === 'auto') h = jimp.AUTO;
		const image = await this.image;
		return image.resize(w, h);
	}

	async scale({ f }: { f: number }): Promise<jimp> {
		const image = await this.image;
		return image.scale(f);
	}

	async scaleToFit({ w, h }: { w: number; h: number }): Promise<jimp> {
		const image = await this.image;
		return image.scaleToFit(w, h);
	}
	//#endregion

	//#region CROP
	async autocrop(tolerance: number, frames: boolean) {
		const image = await this.image;
		return image.autocrop(tolerance, frames);
	}

	async crop(x: number, y: number, w: number, h: number) {
		const image = await this.image;
		return image.crop(x, y, w, h);
	}
	//#endregion

	//#region COMPOSING
	async blit(
		src: jimp,
		x: number,
		y: number,
		srcx: number,
		srcy: number,
		srcw: number,
		srch: number
	) {
		const image = await this.image;
		return image.blit(src, x, y, srcx, srcy, srcw, srch);
	}

	async composite(
		src: jimp,
		x: number,
		y: number,
		mode: number,
		opacitySource: number,
		opacityDest: number
	) {
		const image = await this.image;
		return image.composite(src, x, y, mode, opacitySource, opacityDest);
	}

	async mask(src: jimp, x: number, y: number) {
		const image = await this.image;
		return image.mask(src, x, y);
	}

	async convolute(kernel: number[][]) {
		const image = await this.image;
		return image.convolute(kernel);
	}
	//#endregion

	//#region FLIP AND ROTATE
	async flip(horz: boolean, vert: boolean) {
		const image = await this.image;
		return image.flip(horz, vert);
	}

	async mirror(horz: boolean, vert: boolean) {
		const image = await this.image;
		return image.mirror(horz, vert);
	}

	async rotate(deg: number, mode: boolean) {
		const image = await this.image;
		return image.rotate(deg, mode);
	}
	//#endregion

	//#region COLOR
	async brightness(val: number) {
		const image = await this.image;
		return image.brightness(val);
	}

	async contrast(val: number) {
		const image = await this.image;
		return image.contrast(val);
	}

	async dither565() {
		const image = await this.image;
		return image.dither565();
	}

	async greyscale() {
		const image = await this.image;
		return image.greyscale();
	}

	async invert() {
		const image = await this.image;
		return image.invert();
	}

	async normalize() {
		const image = await this.image;
		return image.normalize();
	}
	//#endregion

	//#region ALPHA CHANNEL
	async hasAlpha() {
		const image = await this.image;
		return image.hasAlpha();
	}

	async fade(f: number) {
		const image = await this.image;
		return image.fade(f);
	}

	async opacity(f: number) {
		const image = await this.image;
		return image.opacity(f);
	}

	async opaque() {
		const image = await this.image;
		return image.opaque();
	}

	async background(hex: number) {
		const image = await this.image;
		return image.background(hex);
	}
	//#endregion

	//#region BLURS
	async gaussian(r: number) {
		const image = await this.image;
		return image.gaussian(r);
	}

	async blur(r: number) {
		const image = await this.image;
		return image.blur(r);
	}
	//#endregion

	//#region EFFECTS
	async posterize(n: number) {
		const image = await this.image;
		return image.posterize(n);
	}

	async sepia() {
		const image = await this.image;
		return image.sepia();
	}

	async pixelate(size: number, x: number, y: number, w: number, h: number) {
		const image = await this.image;
		return image.pixelate(size, x, y, w, h);
	}
	//#endregion

	//#region 3D
	async displace(map: jimp, offset: number) {
		const image = await this.image;
		return image.displace(map, offset);
	}
	//#endregion
}
