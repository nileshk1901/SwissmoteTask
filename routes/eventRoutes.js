import express from "express";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/", async (req, res) => {
	const events = await Event.find();
	res.json(events);
});

router.post("/", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const event = new Event({ ...req.body, createdBy: decoded.id });
		await event.save();
		res.status(201).json(event);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;
