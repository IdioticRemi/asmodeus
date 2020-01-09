import { AsmodeusConfig } from '@lib/typings';

import * as PROD_OPTS from '@root/config';
import * as DEV_OPTS from '@root/config.dev';

export const configEnv = (): AsmodeusConfig => {
	let config: AsmodeusConfig;

	if (process.env.NODE_ENV === 'production') config = PROD_OPTS;
	else config = DEV_OPTS;

	return config;
};
