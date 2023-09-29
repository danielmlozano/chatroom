const service = require("../services/users.service")

class UserController {
	async connectedUsers(req, res) {
		try {
			const users = await service.getUsers()

			res.status(200).json(users)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: "Internal server error" })
		}
	}
}

module.exports = UserController
