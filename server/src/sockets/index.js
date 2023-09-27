const useCache = require("../cache")

const setSockets = async (io) => {
	const cache = await useCache()

	const chatRoomName = "DefaultRoom"

	io.on("connection", (socket) => {
		const socketId = socket.id

		console.log(`Socket ${socketId} connected`)

		socket.on("join", async (data) => {
			const { username } = JSON.parse(data)

			const usernameInUse = await cache.usernameInUse(username)

			if (usernameInUse) {
				socket.emit("usernameTaken", `Username ${username} is taken`)
				return
			}

			socket.join(chatRoomName)

			await cache.setUser(username, socketId)

			socket.emit("joined", `Joined chat as ${username}`)
		})

		socket.on("disconnect", async () => {
			const userDisconnected = await cache.removeUser(socketId)
		})

		socket.on("messageSent", async (data) => {
			const user = await cache.getUser(socketId)
			socket
				.to(chatRoomName)
				.emit("newMessage", { ...JSON.parse(data), user })
		})
	})
}

module.exports = setSockets
