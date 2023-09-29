const service = require("../services/messages.service")
const path = require("path")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

class ChatController {
	async index(req, res) {
		try {
			const messages = await service.getMessages()
			const groupedMessages = service.groupMessagesByDay(messages)
			res.status(200).json(groupedMessages)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: "Internal server error" })
		}
	}

	async store(req, res) {
		const { username, message, image = null } = req.body

		if (image) {
			await service.createMessage(username, "", image)
			return res.status(201).json({})
		}

		if (!username || !message) {
			return res.status(400).json({
				message: "Username and message are required",
			})
		}

		await service.createMessage(username, message)
		res.status(201).json({})
	}

	async upload(req, res) {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded." })
		}

		const { username } = req.body

		// Validate that the uploaded file is an image (you can add more checks here)
		const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]
		const fileExtension = path.extname(req.file.originalname)

		if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
			fs.unlinkSync(req.file.path) // Delete the invalid file
			return res.status(400).json({ error: "Invalid file format." })
		}

		// Return the URL for the uploaded image
		const baseUrl = process.env.BASE_URL || "http://localhost:8000"
		const imageUrl = `${baseUrl}/uploads/${req.file.filename}`

		res.json({ imageUrl })
	}

	async search(req, res) {
		const query = req.query.query

		if (!query) {
			return res.status(400).json({ error: "Query is required." })
		}

		try {
			const messages = await service.searchMessages(query)
			res.status(200).json(messages)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: "Internal server error" })
		}
	}
}

module.exports = ChatController
