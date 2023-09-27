const service = require("../services/messages.service")

class ChatController {
	async index(req, res, next) {
		try {
			const messages = await service.getMessages()
			res.status(200).json(messages)
		} catch (err) {
			next(err)
		}
	}

	async store(req, res, next) {
		const { username, message } = req.body
		if (!username || !message) {
			return res.status(400).json({
				message: "Username and message are required",
			})
		}

		await service.createMessage(username, message)
		res.status(201).json({})
	}

	// async getChat(req, res, next) {
	// 	try {
	// 		const chat = await Chat.findById(req.params.id)
	// 		if (!chat) {
	// 			return res.status(404).json({ message: "Chat not found" })
	// 		}
	// 		res.status(200).json(chat)
	// 	} catch (err) {
	// 		next(err)
	// 	}
	// }

	// async createChat(req, res, next) {
	// 	try {
	// 		const chat = new Chat(req.body)
	// 		await chat.save()
	// 		res.status(201).json(chat)
	// 	} catch (err) {
	// 		next(err)
	// 	}
	// }

	// async deleteChat(req, res, next) {
	// 	try {
	// 		const chat = await Chat.findByIdAndDelete(req.params.id)
	// 		if (!chat) {
	// 			return res.status(404).json({ message: "Chat not found" })
	// 		}
	// 		res.status(200).json({ message: "Chat deleted successfully" })
	// 	} catch (err) {
	// 		next(err)
	// 	}
	// }
}

module.exports = ChatController
