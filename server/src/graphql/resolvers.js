const {
	groupMessagesByDay,
	getMessages,
} = require("../services/messages.service")

const { getUsers } = require("../services/users.service")

const getMessagesGrouped = async () => {
	const messages = await getMessages()
	return groupMessagesByDay(messages)
}

const getUsersList = async () => {
	const users = await getUsers()
	return users
}

const resolvers = {
	Query: {
		messages: getMessagesGrouped,
		users: getUsersList,
	},
}

module.exports = resolvers
