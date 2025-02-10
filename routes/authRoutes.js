import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json({ message: "User registered" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ error: "Invalid credentials" });
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token, user: { id: user._id, name: user.name } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/guest-login", async (req, res) => {
	try {
		const guestUser = new User({ name: "Guest User", isGuest: true });
		await guestUser.save();
		const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token, user: { id: guestUser._id, name: guestUser.name } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
