<script setup lang="ts">
	import { onMounted, ref, nextTick } from "vue"
	import { storeToRefs } from "pinia"
	import useStore from "@Composables/useStore"
	import { apiFetch } from "@Composables/useForm"
	import { PrimaryButton, TextInput } from "@Forms"
	import ChatBubble from "@Components/ChatBubble.vue"
	import { IMessage, IMessageGroup } from "@/Interfaces"

	const store = useStore()

	const { user, connectedUsers } = storeToRefs(store)

	const message = ref<string>("")

	const messages = ref<IMessageGroup[]>([])

	const sendMessage = () => {
		if (!message.value) {
			return
		}

		store.socket.emit(
			"messageSent",
			JSON.stringify({ message: message.value }),
		)

		const NewMessage = {
			message: message.value,
			username: user.value.username,
		} as IMessage

		pushMessage(NewMessage)
		message.value = ""
	}

	const fetchChatHistory = async () => {
		const response = await apiFetch("/messages")
		messages.value = response
		scrollToBottom()
	}

	const fetchUsers = async () => {
		const response = await apiFetch("/users")
		store.setConnectedUsers(response)
	}

	const scrollToBottom = async () => {
		await nextTick()
		const chat = document.getElementById("chat")
		if (chat !== null) {
			chat.scrollTop = chat.scrollHeight
		}
	}

	const pushMessage = (newMessage: IMessage) => {
		// Push the message to the message group of Today to the array
		const todayGroup = messages.value.find(
			(group) => group.date === "Today",
		)

		if (!todayGroup) {
			messages.value.push({
				date: "Today",
				messages: [],
			})
		}

		messages.value
			.find((group) => group.date === "Today")
			?.messages.push({
				message: newMessage.message,
				username: newMessage.username,
			} as IMessage)
		scrollToBottom()
	}

	onMounted(() => {
		fetchChatHistory()
		fetchUsers()
		store.socket.on("newMessage", (data) => {
			const message: IMessage = data
			pushMessage(message)
		})

		store.socket.on("userDisconnected", (socketId) => {
			store.disconnectUser(socketId)
		})

		store.socket.on("userJoined", (user) => {
			store.addConnectedUser(user)
		})
	})
</script>
<template>
	<div class="flex">
		<div class="w-full lg:w-1/6">
			<div class="flex flex-col justify-start h-screen py-5 px-5">
				<h1 class="text-white text-xl text-center">ChatRoom</h1>
				<div class="users mt-10">
					<!-- List of connected users -->
					<span class="text-white font-medium">Users online</span>
					<ul class="mt-5">
						<li
							v-for="(user, i) in connectedUsers"
							:key="i"
							class="w-full mb-1"
						>
							<div class="flex items-center py-2 px-3">
								<div class="flex-shrink-0">
									<span
										class="inline-block h-2 w-2 rounded-full bg-green-400"
									></span>
								</div>
								<div class="ml-3">
									<p
										class="text-sm font-medium text-gray-200"
									>
										{{ user.username }}
									</p>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="w-full bg-white lg:w-5/6 pl-10 flex flex-col h-screen">
			<div class="flex-col max-h-full grow overflow-y-scroll" id="chat">
				<div
					v-for="(group, i) in messages"
					:key="i"
					class="flex flex-col mb-4"
				>
					<div class="flex flex-col mb-2">
						<span class="font-semibold text-gray-800 text-center">
							{{ group.date }}
						</span>
					</div>
					<div
						v-for="(message, i) in group.messages"
						:key="i"
						class="flex mb-2 w-full py-5"
					>
						<ChatBubble :message="message" />
					</div>
				</div>
			</div>

			<div
				class="flex-none w-full pr-10 self-end flex-shrink-0 flex-grow-0 mb-4"
			>
				<form class="flex mt-4 w-full" @submit.prevent="sendMessage">
					<TextInput
						v-model="message"
						placeholder="Your message"
						class="placeholder-gray-500"
						@key-enter="sendMessage"
					/>
					<PrimaryButton :disabled="!message" type="submit"
						>Send</PrimaryButton
					>
				</form>
			</div>
		</div>
	</div>
</template>
