<script setup lang="ts">
	import { onMounted, ref } from "vue"
	import useStore from "@Composables/useStore"
	import { apiFetch } from "@Composables/useForm"
	import { PrimaryButton, TextInput } from "@Forms"
	import ChatBubble from "@Components/ChatBubble.vue"
	import { IMessageGroup } from "@/Interfaces"

	const { socket, user } = useStore()

	const message = ref<string>("")

	const sendMessage = () => {
		if (!message.value) {
			return
		}

		socket.emit("messageSent", JSON.stringify({ message: message.value }))
	}

	const messages = ref<IMessageGroup[]>([])

	const fetchChatHistory = async () => {
		const response = await apiFetch("/messages")
		messages.value = response
	}

	onMounted(() => {
		fetchChatHistory()
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
			<div class="flex-col max-h-full grow overflow-y-scroll">
				<div
					v-for="(group, i) in messages"
					:key="i"
					class="flex flex-col mb-4"
				>
					<div class="flex flex-col mb-2">
						<span class="font-bold text-gray-800">{{
							group.date
						}}</span>
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
				class="flex-none w-full pr-10 self-end flex-shrink-0 flex-grow-0"
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
