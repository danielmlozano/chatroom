const client = require("../cache")

const cacheName = "chat:usernames"

client.connect()

client.del(cacheName)

const usernameInUse = async (username) => {
	const result = await client.hGet(cacheName, username)
	return result
}

const setUser = async (username, socketId) => {
	const result = await client.hSet(cacheName, username, socketId)

	return result
}

const removeUser = async (socketId) => {
	const users = await client.hGetAll(cacheName)

	const username = Object.keys(users).find((key) => users[key] === socketId)

	if (!username) {
		return
	}

	await client.hDel(cacheName, username)
	return username
}

const getUser = async (socketId) => {
	const users = await client.hGetAll(cacheName)

	const username = Object.keys(users).find((key) => users[key] === socketId)

	return username
}

const getUsers = async () => {
	const users = await client.hGetAll(cacheName)
	const userList = Object.entries(users).map(([username, socketId]) => ({
		username,
		socketId,
	}))
	return userList
}

const generateUsername = async (username) => {
	const randomDigits = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0")
	const newUsername = `${username}${randomDigits}`

	if (await usernameInUse(newUsername)) {
		return generateUsername(newUsername)
	}
	return newUsername
}

// module.exports = usersService

module.exports = {
	usernameInUse,
	setUser,
	removeUser,
	getUser,
	generateUsername,
	getUsers,
}
