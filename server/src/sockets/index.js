const usersService = require("../services/users.service")
const messagesService = require("../services/messages.service")

const setSockets = async (io) => {
	const chatRoomName = "DefaultRoom"
	const { usernameInUse, setUser, removeUser, getUser } = await usersService
	io.on("connection", (socket) => {
		const socketId = socket.id

		socket.on("join", async (data) => {
			const { username } = JSON.parse(data)

			socket.join(chatRoomName)

			const isUsernameTaken = await usernameInUse(username)

			if (isUsernameTaken) {
				io.to(chatRoomName).emit(
					"usernameTaken",
					`Username ${username} is taken`,
				)
				return
			}

			await setUser(username, socketId)

			const message = `Joined ${chatRoomName} as ${username}`

			io.to(chatRoomName).emit("joined", message)
		})

		socket.on("disconnect", async () => {
			const userDisconnected = await removeUser(socketId)
		})

		socket.on("messageSent", async (data) => {
			const user = await getUser(socketId)

			console.log(`sending message from ${user}`)

			if (!user) {
				return
			}

			const { message } = JSON.parse(data)

			messagesService.createMessage(user, message)

			io.to(chatRoomName).emit("newMessage", {
				message,
				username: user,
				timestamp: Date.now(),
			})
		})
	})
}

module.exports = setSockets
