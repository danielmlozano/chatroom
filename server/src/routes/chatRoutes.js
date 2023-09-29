const express = require("express")
const ChatController = require("../controllers/chatController")
const chats = new ChatController()

const setChatRoutes = (app) => {
	const router = express.Router()

	app.use("/api/messages", router)

	router.get("/", (req, res) => {
		chats.index(req, res)
	})

	router.post("/", (req, res) => {
		chats.store(req, res)
	})
}

module.exports = setChatRoutes
