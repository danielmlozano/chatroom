<script setup lang="ts">
	import { onMounted, ref, nextTick, watch } from "vue"
	import { storeToRefs } from "pinia"
	import useStore from "@Composables/useStore"
	import gql from "graphql-tag"
	import { useQuery } from "@vue/apollo-composable"
	import { PrimaryButton, TextInput } from "@Forms"
	import ChatBubble from "@Components/ChatBubble.vue"
	import { IMessage, IMessageGroup } from "@/Interfaces"
	import UploadImage from "@Components/UploadImage.vue"
	import { cloneDeep } from "lodash"

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

		const newMessage = {
			message: message.value,
			username: user.value.username,
		} as IMessage

		message.value = ""
	}

	const sentImageMessage = (imageUrl: string) => {
		store.socket.emit(
			"messageSent",
			JSON.stringify({ image: imageUrl, message: "" }),
		)

		const newMessage = {
			fileUrl: imageUrl,
			message: "",
			username: user.value.username,
		} as IMessage

		message.value = ""
	}

	const { result } = useQuery(
		gql`
			query Data {
				messages {
					date
					messages {
						_id
						username
						message
						fileUrl
					}
				}
				users {
					username
					tokenId
				}
			}
		`,
	)

	watch(result, (value) => {
		store.setConnectedUsers(cloneDeep(value.users))
		messages.value = cloneDeep(value.messages)
	})

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
				fileUrl: newMessage.fileUrl,
				username: newMessage.username,
			} as IMessage)
		scrollToBottom()
	}

	onMounted(() => {
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

	const drawerOpen = ref<boolean>(false)
</script>
<template>
	<div class="flex">
		<!-- Drawer here only on mobile -->
		<div class="block md:hidden fixed inset-0 z-50" v-show="drawerOpen">
			<div class="absolute inset-0 bg-gray-900 opacity-75"></div>
			<div class="fixed inset-y-0 right-0 max-w-full flex">
				<div class="w-screen max-w-md">
					<div class="h-full flex flex-col bg-white shadow-xl">
						<div
							class="flex justify-between items-center px-6 py-4 bg-gray-900"
						>
							<h2 class="text-lg font-medium text-white">
								Users online
							</h2>
							<button
								type="button"
								class="text-gray-500 hover:text-gray-400 focus:outline-none focus:text-gray-400"
								@click="drawerOpen = false"
							>
								<svg
									class="h-6 w-6 fill-current"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18.2929 5.29289C18.6834 4.90237 19.3166 4.90237 19.7071 5.29289C20.0976 5.68342 20.0976 6.31658 19.7071 6.70711L13.4142 13L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L12 14.4142L5.70711 20.7071C5.31658 21.0976 4.68342 21.0976 4.29289 20.7071C3.90237 20.3166 3.90237 19.6834 4.29289 19.2929L10.5858 13L4.29289 6.70711C3.90237 6.31658 3.90237 5.68342 4.29289 5.29289C4.68342 4.90237 5.31658 4.90237 5.70711 5.29289L12 11.5858L18.2929 5.29289Z"
									/>
								</svg>
							</button>
						</div>
						<div class="flex-1 overflow-y-auto">
							<ul class="px-4 py-6">
								<li
									v-for="(user, i) in connectedUsers"
									:key="i"
									class="flex items-center py-2"
								>
									<div class="flex-shrink-0">
										<span
											class="inline-block h-2 w-2 rounded-full bg-green-400"
										></span>
									</div>
									<div class="ml-3">
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{ user.username }}
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Sidebar -->

		<div class="hidden md:block md:w-2/6 lg:w-1/6">
			<div class="flex flex-col justify-start h-screen py-5 px-5">
				<h1 class="text-white text-xl text-center">ChatRoom</h1>
				<p class="text-white mt-2">
					Welcome
					<span class="text-blue-500">{{ user.username }}</span>
				</p>
				<div class="users mt-4">
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
		<div
			class="w-full bg-white md:w-4/6 lg:w-5/6 pl-10 flex flex-col h-screen"
		>
			<!-- Burger button to open drawer only on mobile -->
			<div
				class="flex justify-between md:hidden container mx-auto mb-10 items-center h-20"
			>
				<h1>ChatRoom</h1>
				<button
					type="button"
					class="text-gray-500 hover:text-gray-400 focus:outline-none focus:text-gray-400 mr-10"
					@click="drawerOpen = !drawerOpen"
				>
					<svg
						class="h-6 w-6 fill-current"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 6H20M4 12H20M4 18H11"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
			<div
				class="flex-col max-h-full grow overflow-y-scroll mx-5"
				id="chat"
			>
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
					<UploadImage @uploaded="sentImageMessage" />
					<PrimaryButton :disabled="!message" type="submit"
						>Send</PrimaryButton
					>
				</form>
			</div>
		</div>
	</div>
</template>
