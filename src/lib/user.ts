// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const isLogin = writable<boolean>(false);
export const user = writable<User | null>();
