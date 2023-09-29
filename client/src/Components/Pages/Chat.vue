<script setup lang="ts">
	import { onMounted, ref, nextTick } from "vue"
	import useStore from "@Composables/useStore"
	import { apiFetch } from "@Composables/useForm"
	import { PrimaryButton, TextInput } from "@Forms"
	import ChatBubble from "@Components/ChatBubble.vue"
	import { IMessage, IMessageGroup } from "@/Interfaces"

	const { socket, user } = useStore()

	const message = ref<string>("")

	const sendMessage = () => {
		if (!message.value) {
			return
		}

		socket.emit("messageSent", JSON.stringify({ message: message.value }))

		const NewMessage = {
			message: message.value,
			username: user.username,
		} as IMessage

		pushMessage(NewMessage)
		message.value = ""
	}

	const messages = ref<IMessageGroup[]>([])

	const fetchChatHistory = async () => {
		const response = await apiFetch("/messages")
		messages.value = response
		scrollToBottom()
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
		socket.on("newMessage", (data) => {
			const message: IMessage = data
			pushMessage(message)
		})
	})
</script>
<template>
	<div class="flex">
		<div class="w-full lg:w-1/6">
			<div
				class="flex flex-col items-center justify-center h-screen"
			></div>
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
