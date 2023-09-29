const service = require("../services/messages.service")
const path = require("path")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

/**
 * Groups chat messages by day and sorts them in chronological order.
 *
 * @param {Array} messages - An array of chat messages.
 * @returns {Array} An array of objects, each containing a date and an array of messages for that date.
 */
const groupMessagesByDay = (messages) => {
	if (!messages || !messages.length) return []
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	const groups = messages.reduce((acc, message) => {
		const createdAt = new Date(message.createdAt)
		let date

		if (createdAt.toDateString() === today.toDateString()) {
			date = "Today"
		} else if (createdAt.toDateString() === yesterday.toDateString()) {
			date = "Yesterday"
		} else {
			date = createdAt.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		}

		acc[date] = acc[date] || []
		acc[date].push(message)

		return acc
	}, {})

	const sortedGroups = Object.entries(groups)
		.sort(([a], [b]) => {
			if (a === "Today") return 1
			if (b === "Today") return -1
			if (a === "Yesterday") return 1
			if (b === "Yesterday") return -1
			return new Date(a) > new Date(b)
				? 1
				: new Date(a) < new Date(b)
				? -1
				: 0
		})
		.reduce((acc, [key, value]) => {
			acc[key] = value
			return acc
		}, {})

	const result = Object.entries(sortedGroups).map(([key, value]) => ({
		date: key,
		messages: value.sort(
			(a, b) => new Date(a.createdAt) - new Date(b.createdAt),
		),
	}))

	return result
}

class ChatController {
	async index(req, res) {
		try {
			const messages = await service.getMessages()
			const groupedMessages = groupMessagesByDay(messages)
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
}

module.exports = ChatController
