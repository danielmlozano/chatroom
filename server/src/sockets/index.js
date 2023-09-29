const usersService = require("../services/users.service")
const messagesService = require("../services/messages.service")

const setSockets = async (io) => {
	const chatRoomName = "DefaultRoom"

	const { usernameInUse, setUser, removeUser, getUser, generateUsername } =
		await usersService

	io.on("connection", (socket) => {
		const socketId = socket.id

		socket.on("join", async (data) => {
			const { username } = JSON.parse(data)

			let finalUsername = username

			socket.join(chatRoomName)

			const isUsernameTaken = await usernameInUse(username)

			if (isUsernameTaken) {
				const newUserName = await generateUsername(username)
				socket.emit("usernameTaken", {
					message: `The username ${username} is already taken. Trying with ${newUserName}`,
					newUserName,
				})
				// Wait 3 seconds before joining the room
				finalUsername = newUserName
				await new Promise((resolve) => setTimeout(resolve, 3000))
			}

			await setUser(finalUsername, socketId)

			const message = `Joined ${chatRoomName} as ${finalUsername}`

			io.to(chatRoomName).emit("joined", message)
			io.to(chatRoomName).emit("userJoined", {
				username: finalUsername,
				socketId,
			})
		})

		socket.on("disconnecting", async () => {
			io.to(chatRoomName).emit("userDisconnected", socketId)
		})

		socket.on("disconnect", async () => {
			const userDisconnected = await removeUser(socketId)
		})

		socket.on("messageSent", async (data) => {
			const user = await getUser(socketId)

			if (!user) {
				return
			}

			const { message, image = null } = JSON.parse(data)

			messagesService.createMessage(user, message, image)

			io.to(chatRoomName).emit("newMessage", {
				message,
				username: user,
				fileUrl: image,
				createdAt: Date.now(),
			})
		})
	})
}

module.exports = setSockets
