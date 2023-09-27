jest.setTimeout(600000) // Increase timeout to 10000ms
const io = require("socket.io")()
const setSockets = require("../src/sockets")

describe("setSockets", () => {
	let clientSocket

	beforeEach(() => {
		io.listen(3001)
		setSockets(io)

		clientSocket = require("socket.io-client")("http://localhost:3001")

		// Use a promise to handle the socket connection
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
		console.log("Test Joining chat room")

		const username = "testuser"

		const socketPromise = new Promise((resolve, reject) => {
			clientSocket.on("joined", (data) => {
				try {
					expect(data).toBe(`Joined chat as ${username}`)
					resolve()
				} catch (error) {
					reject(error)
				}
			})
		})

		clientSocket.emit("join", JSON.stringify({ username }))

		return socketPromise
	})
})
