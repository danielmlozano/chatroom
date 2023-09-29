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

module.exports = {
	createMessage,
	getMessages,
}
