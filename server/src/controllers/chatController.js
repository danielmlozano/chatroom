const Chat = require("../models/chat")

class ChatController {
	async getChats(req, res, next) {
		try {
			const chats = await Chat.find()
			res.status(200).json(chats)
		} catch (err) {
			next(err)
		}
	}

	async getChat(req, res, next) {
		try {
			const chat = await Chat.findById(req.params.id)
			if (!chat) {
				return res.status(404).json({ message: "Chat not found" })
			}
			res.status(200).json(chat)
		} catch (err) {
			next(err)
		}
	}

	async createChat(req, res, next) {
		try {
			const chat = new Chat(req.body)
			await chat.save()
			res.status(201).json(chat)
		} catch (err) {
			next(err)
		}
	}

	async deleteChat(req, res, next) {
		try {
			const chat = await Chat.findByIdAndDelete(req.params.id)
			if (!chat) {
				return res.status(404).json({ message: "Chat not found" })
			}
			res.status(200).json({ message: "Chat deleted successfully" })
		} catch (err) {
			next(err)
		}
	}
}

module.exports = ChatController
