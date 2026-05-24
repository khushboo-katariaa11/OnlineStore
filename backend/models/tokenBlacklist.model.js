const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema(
	{
		jti: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

// MongoDB TTL — auto-delete expired blacklist entries
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;
