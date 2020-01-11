export enum Permission {
	// Anyone
	Default = 0,

	// Guild related
	Moderator = 5,
	Administrator = 6,
	GuildOwner = 7,

	// Bot related
	BotSupport = 8,

	// Owner(s) related
	Owner = 9,
	OwnerHidden = 10
}
