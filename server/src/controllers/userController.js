const service = require("../services/users.service")

class UserController {
	async connectedUsers(req, res, next) {
		try {
			const users = await service.getUsers()
			res.status(200).json(users)
		} catch (err) {
			next(err)
		}
	}
}

module.exports = UserController
