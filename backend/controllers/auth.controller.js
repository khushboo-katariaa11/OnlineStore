const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { signAdminToken } = require('../utils/jwt');
const { blacklistToken } = require('../services/tokenBlacklist.service');

const loginUserController = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				message: errors.array()[0]?.msg || 'Validation failed.',
			});
		}

		const email = String(req.body.email).trim().toLowerCase();
		const { password } = req.body;

		const admin = await Admin.findOne({ email });
		if (!admin) {
			return res.status(401).json({ message: 'Invalid email or password.' });
		}

		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid email or password.' });
		}

		const { token, expiresIn } = signAdminToken(admin);

		res.json({
			token,
			expiresIn,
			user: { email: admin.email, id: admin._id },
		});
	} catch (error) {
		next(error);
	}
};

const getUserController = async (req, res, next) => {
	try {
		const admin = await Admin.findById(req.user.adminId).select('-password');

		if (!admin) {
			return res.status(404).json({ message: 'Admin not found.' });
		}

		res.json({ user: admin });
	} catch (error) {
		next(error);
	}
};

const logoutUserController = async (req, res, next) => {
	try {
		await blacklistToken(req.user, req.user.adminId);
		res.json({ message: 'Logged out successfully.' });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	loginUserController,
	getUserController,
	logoutUserController,
};
