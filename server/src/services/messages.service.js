const Message = require("../models/message")

const createMessage = async (username, text) => {
	return await Message.create({ username, message: text })
}

const getMessages = async () => {
	const messages = await Message.find()
	return messages
}

module.exports = {
	createMessage,
	getMessages,
}
