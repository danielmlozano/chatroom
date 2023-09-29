interface IMessage {
	id: string
	username: string
	message: string
	createdAt: string
}

interface IMessageGroup {
	date: string
	messages: IMessage[]
}

export { IMessage, IMessageGroup }
