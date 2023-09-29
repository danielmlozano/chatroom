<script setup lang="ts">
	import { onMounted, ref } from "vue"
	import useStore from "@Composables/useStore"
	import { useForm, apiFetch } from "@Composables/useForm"

	import { PrimaryButton, TextInput } from "@Forms"

	const { socket, user } = useStore()

	const form = useForm({
		message: "",
	})

	const sendMessage = () => {
		//
	}

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

	const messages = ref<IMessageGroup[]>([])

	const fetchChatHistory = async () => {
		const response = await apiFetch("/messages")
		messages.value = response
	}

	const isIncomingMessage = (message: IMessage): boolean => {
		return message.username !== user.username
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
		<div class="w-full bg-white lg:w-5/6 pl-10 h-screen flex-col">
			<div class="flex-col grow">
				<div
					class="flex flex-col-reverse overflow-y-scroll"
					style="height: 100%"
				>
					<div
						v-for="(group, i) in messages"
						:key="i"
						class="flex flex-col mb-4"
					>
						<div class="flex flex-col mb-2">
							<span class="font-bold text-gray-800">
								{{ group.date }}
							</span>
						</div>
						<div
							v-for="(message, i) in group.messages"
							:key="i"
							class="flex mb-2 w-full py-5"
						>
							<template v-if="isIncomingMessage(message)">
								<!-- Incoming message bubble -->
								<div
									class="flex flex-col w-full items-start space-y-2 my-2"
								>
									<div class="flex items-center space-x-2">
										<img
											src="https://via.placeholder.com/32"
											alt="User Avatar"
											class="w-6 h-6 rounded-full"
										/>
										<span
											class="text-sm font-medium text-gray-700"
										>
											{{ message.username }}</span
										>
									</div>
									<div class="bg-gray-100 rounded-lg p-2">
										<p class="text-sm text-gray-800">
											{{ message.message }}
										</p>
									</div>
								</div>
							</template>
							<template v-else>
								<div
									class="flex flex-col w-full items-end space-y-2 my-2"
								>
									<div class="bg-blue-500 rounded-lg p-2">
										<p class="text-sm text-white">
											{{ message.message }}
										</p>
									</div>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>

			<div class="flex-none w-full">
				<form class="flex mt-4 w-full" @submit.prevent="sendMessage">
					<TextInput
						v-model="form.message"
						placeholder="Username"
						@key-enter="sendMessage"
					/>
					<PrimaryButton :disabled="!!form.message" type="submit">
						Join
					</PrimaryButton>
				</form>
			</div>
		</div>
	</div>
</template>
