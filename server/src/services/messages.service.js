const Message = require("../models/message")

const createMessage = async (username, text, file = null) => {
	return await Message.create({
		username,
		message: text,
		fileUrl: file,
		fileMimeType: "image",
	})
}

const getMessages = async () => {
	const messages = await Message.find().sort({ createdAt: 1 })
	return messages
}

const searchMessages = async (query) => {
	const messages = await Message.find({
		message: { $eq: query },
	}).sort({ createdAt: 1 })
	return messages
}

module.exports = {
	createMessage,
	getMessages,
	searchMessages,
}
