import { T } from './Shared';

/* eslint-disable @typescript-eslint/no-namespace */

export namespace UserSchema {
	export const Premium = T<boolean>('premium');
	export const Playlists = T<Array<any>>('playlists');
}
