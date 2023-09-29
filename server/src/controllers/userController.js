const service = require("../services/users.service")

class UserController {
	async connectedUsers(req, res) {
		try {
			const users = await service.getUsers()
			const userList = Object.entries(users).map(
				([username, socketId]) => ({
					username,
					socketId,
				}),
			)
			res.status(200).json(userList)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: "Internal server error" })
		}
	}
}

module.exports = UserController
