const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: false,
		},
		fileUrl: {
			type: String,
			required: false,
		},
		fileMimeType: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model("Message", messageSchema)
