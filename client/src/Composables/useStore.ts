import { defineStore } from "pinia"
import { io } from "socket.io-client"
const URL = (import.meta as any).env.VITE_SOCKET_URL as string

interface IUser {
	username: string
	connected?: boolean
	socketId?: string
}

const useStore = defineStore("main", {
	state: () => ({
		user: {
			username: "",
			connected: false,
		} as IUser,
		connectedUsers: [] as IUser[],
		socket: io(URL, {
			autoConnect: false,
		}),
	}),
	actions: {
		setUser(user: IUser) {
			this.user = user
		},
		setUsername(username: string) {
			this.user.username = username
		},
		setConnected(connected: boolean) {
			this.user.connected = connected
		},
		setConnectedUsers(users: IUser[]) {
			this.connectedUsers = users
		},
		disconnectUser(socketId: string) {
			this.connectedUsers = this.connectedUsers.filter(
				(user) => user.socketId !== socketId,
			)
		},
		addConnectedUser(user: IUser) {
			this.connectedUsers.push(user)
		},
	},
})

export default useStore
