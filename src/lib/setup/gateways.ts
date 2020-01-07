import { AsmodeusClient } from '@shard/client';
import { GuildSchema, UserSchema } from '@enum/schema';

AsmodeusClient.defaultGuildSchema
	.add(GuildSchema.Premium, 'boolean', { 'default': false });

AsmodeusClient.defaultUserSchema
	.add(UserSchema.Premium, 'boolean', { 'default': false })
	.add(UserSchema.Playlists, 'any', { 'default': [], 'array': true });
