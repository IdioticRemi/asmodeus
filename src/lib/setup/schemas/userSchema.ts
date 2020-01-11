import { AsmodeusClient } from '@shard/client';

AsmodeusClient.defaultUserSchema
	.add('premium', 'boolean', { 'default': false })
	.add('playlists', 'any', { 'default': [], 'array': true });
