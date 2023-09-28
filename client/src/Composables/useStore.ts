import { defineStore } from "pinia"
import { io } from "socket.io-client"
const URL = (import.meta as any).env.VITE_SOCKET_URL as string

interface IUser {
	username: string
	connected: boolean
}

const useStore = defineStore("main", {
	state: () => ({
		user: {
			username: "",
			connected: false,
		} as IUser,
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
	},
})

export default useStore
