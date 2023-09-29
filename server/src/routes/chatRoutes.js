const express = require("express")
const ChatController = require("../controllers/chatController")
const chats = new ChatController()
const upload = require("../middleware/multer")

const setChatRoutes = (app) => {
	const router = express.Router()

	app.use("/api/messages", router)

	router.get("/", chats.index)

	router.get("/search", chats.search)

	router.post("/", chats.store)

	router.post("/upload", upload.single("file"), chats.upload)
}

module.exports = setChatRoutes
