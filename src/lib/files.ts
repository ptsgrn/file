// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writable } from 'svelte/store';

interface FileData {
	id: number;
	name: string;
	size: number;
	type: string;
	isUploaded: boolean;
	file: File;
	snapshot?: unknown;
	error?: unknown;
}

export const files = writable<File[]>([]);
export const fileData = writable<FileData[]>([]);
