import mongoose from "mongoose";
import bcrypt from "bcrypt";

const EventSchema = new mongoose.Schema({
	name: String,
	description: String,
	date: Date,
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
export default mongoose.model("Event", EventSchema);
