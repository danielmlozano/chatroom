interface IMessage {
	_id?: string
	username: string
	message: string
	fileUrl?: string
	createdAt: string
}

interface IMessageGroup {
	date: string
	messages: IMessage[]
}

export { IMessage, IMessageGroup }
