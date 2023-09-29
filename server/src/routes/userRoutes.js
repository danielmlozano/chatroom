const express = require("express")
const UserController = require("../controllers/userController")
const users = new UserController()

const setUserRoutes = (app) => {
	const router = express.Router()

	app.use("/api/users", router)

	router.get("/", (req, res) => {
		users.connectedUsers(req, res)
	})
}

module.exports = setUserRoutes
