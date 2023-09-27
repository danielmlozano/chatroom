const express = require("express")
const ChatController = require("../controllers/chatController")
const chats = new ChatController()

const setChatRoutes = (app) => {
	const router = express.Router()

	app.use("/api/chats", router)

	router.get("/", (req, res) => {
		chats.getChats(req, res)
	})

	router.post("/", (req, res) => {
		chats.createChat(req, res)
	})
}

// router.get("/:id", ChatController.getChat)

// router.post("/", ChatController.createChat)

// router.delete("/:id", ChatController.deleteChat)

module.exports = setChatRoutes
