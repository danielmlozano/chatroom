const redis = require("redis")

const useCache = async () => {
	let client

	const cacheName = "chat:usernames"

	const getClient = async () => {
		if (client) {
			return client
		}

		client = redis.createClient({
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			password: process.env.REDIS_PASSWORD,
		})

		client.on("error", (err) => console.error(err))

		await client.connect()
		await client.del(cacheName)

		return client
	}

	const closeClient = async () => {
		if (!client) {
			return
		}

		await client.quit()
		client = null
	}

	// Delete cache on server start
	return {
		usernameInUse: async (username) => {
			await getClient()
			const result = client.hGet(cacheName, username)
			await closeClient()
			return result
		},

		setUser: async (username, socketId) => {
			const result = await getClient()
			client.hSet(cacheName, username, socketId)
			await closeClient()
			return result
		},

		removeUser: async (socketId) => {
			await getClient()

			const users = await client.hGetAll(cacheName)

			const username = Object.keys(users).find(
				(key) => users[key] === socketId,
			)

			if (!username) {
				await closeClient()
				return
			}

			await client.hDel(cacheName, username)
			await closeClient()
			return username
		},

		getUser: async (socketId) => {
			await getClient()
			const users = client.hGetAll(cacheName)

			const username = Object.keys(users).find(
				(key) => users[key] === socketId,
			)

			return username
		},
	}
}

module.exports = useCache
