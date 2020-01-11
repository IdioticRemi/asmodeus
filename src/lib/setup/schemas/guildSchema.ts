import { AsmodeusClient } from '@shard/client';

AsmodeusClient.defaultGuildSchema
	.add('premium', 'boolean', { 'default': false })
	.add('roles', folder => folder
		.add('moderator', 'role')
		.add('admin', 'role'));
