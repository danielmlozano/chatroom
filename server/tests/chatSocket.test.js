const io = require("socket.io")()
const setSockets = require("../src/sockets")
const { createMessage } = require("../src/services/messages.service")

jest.mock("./../src/services/users.service", () => {
	const cache = {}

	return {
		usernameInUse: jest.fn(async (username) => {
			return cache[username] || null
		}),

		setUser: jest.fn(async (username, socketId) => {
			cache[username] = socketId
		}),

		removeUser: jest.fn(async (socketId) => {
			const username = Object.keys(cache).find(
				(key) => cache[key] === socketId,
			)

			if (!username) {
				return null
			}

			delete cache[username]

			return username
		}),

		getUser: jest.fn(async (socketId) => {
			const username = Object.keys(cache).find(
				(key) => cache[key] === socketId,
			)

			return username || null
		}),
	}
})

jest.mock("./../src/services/messages.service", () => {
	return {
		createMessage: jest.fn(async (username, text) => {
			return { username, message: text }
		}),

		getMessages: jest.fn(async () => {
			return [
				{ username: "testuser", message: "Hello World" },
				{ username: "testuser", message: "Hello World 2" },
			]
		}),
	}
})

describe("setSockets", () => {
	let clientSocket

	beforeEach(() => {
		io.listen(3001)
		setSockets(io)

		clientSocket = require("socket.io-client")("http://localhost:3001")

		const connectPromise = new Promise((resolve, reject) => {
			clientSocket.on("connect", () => {
				resolve()
			})

			clientSocket.on("connect_error", (error) => {
				console.error("Connection error:", error)
				reject(error)
			})
		})
		return connectPromise
	})

	afterEach(() => {
		io.close()
		clientSocket.close()
	})

	test("should join chat room", () => {
		const username = "testuser"

		const socketPromise = new Promise((resolve, reject) => {
			clientSocket.on("joined", (data) => {
				try {
					expect(data).toBe(`Joined DefaultRoom as ${username}`)
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		})

		clientSocket.emit("join", JSON.stringify({ username }))

		return socketPromise
	})

	test("Username is already taken", async () => {
		const username = "testuser"

		clientSocket.emit("join", JSON.stringify({ username }))

		const clientSocketJoined = () =>
			new Promise((resolve, reject) => {
				clientSocket.on("joined", (data) => {
					try {
						resolve()
					} catch (error) {
						reject(error)
					}
				})
			})

		await clientSocketJoined()

		const clientSocket2 = require("socket.io-client")(
			"http://localhost:3001",
		)

		clientSocket2.emit("join", JSON.stringify({ username }))

		const socketPromise = new Promise((resolve, reject) => {
			clientSocket2.on("usernameTaken", (data) => {
				try {
					expect(data).toBe(`Username ${username} is taken`)
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		})

		return socketPromise
	})

	test("User sends message", async () => {
		const username = "user1"

		clientSocket.emit("join", JSON.stringify({ username }))

		const clientSocketJoined = () =>
			new Promise((resolve, reject) => {
				clientSocket.on("joined", (data) => {
					try {
						resolve()
					} catch (error) {
						reject(error)
					}
				})
			})

		await clientSocketJoined()

		const message = "Hello World"

		const socketPromise = new Promise((resolve, reject) => {
			clientSocket.on("newMessage", (data) => {
				try {
					const {
						message: messageReceived,
						username: usernameReceived,
					} = data

					expect(Object.keys(data)).toEqual([
						"message",
						"username",
						"timestamp",
					])

					expect(messageReceived).toBe(message)
					expect(usernameReceived).toBe(username)

					expect(createMessage).toHaveBeenCalledWith(
						username,
						message,
					)

					resolve()
				} catch (error) {
					reject(error)
				}
			})
		})

		clientSocket.emit("messageSent", JSON.stringify({ message }))

		return socketPromise
	})
})
