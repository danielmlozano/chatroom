<script setup lang="ts">
	import { ref, computed, onMounted } from "vue"
	import useStore from "@Composables/useStore"
	import SplashIcon from "@Components/Icons/SplashIcon.vue"
	import { PrimaryButton, TextInput } from "@Forms"

	const username = ref("")

	const usernameTaken = ref<string>("")

	const autoGenerateUsername = ref<string>("")

	const canJoin = computed<boolean>(() => {
		return !!username.value
	})

	const { socket, setUser } = useStore()

	const joinChat = async (): Promise<void> => {
		console.log("Joining chat")
		await socket.connect()
		socket.emit("join", JSON.stringify({ username: username.value }))
	}

	socket.on("joined", () => {
		setUser({
			username: autoGenerateUsername.value || username.value,
			connected: true,
		})
	})

	socket.on("usernameTaken", ({ message, newUserName }) => {
		usernameTaken.value = message
		autoGenerateUsername.value = newUserName
	})
</script>
<template>
	<div class="h-screen flex">
		<div class="bg-white hidden md:block md:w-1/2">
			<div class="flex flex-col items-center justify-center h-full">
				<SplashIcon class="w-1/2" />
				<h1 class="text-3xl font-bold text-gray-800">
					Welcome to <span class="text-blue-500">our Chatroom</span>
				</h1>
			</div>
		</div>
		<div class="w-full md:w-1/2 flex items-center">
			<div class="w-3/4 mx-auto">
				<h1 class="text-xl text-gray-100">
					Please enter your username to continue
				</h1>
				<div class="flex-col mt-4">
					<form class="flex mt-4 w-full" @submit.prevent="joinChat">
						<TextInput v-model="username" placeholder="Username" />
						<PrimaryButton :disabled="!canJoin" type="submit">
							Join
						</PrimaryButton>
					</form>
					<!-- Username already taken notice -->
					<div class="mt-2" v-if="usernameTaken">
						<span class="text-red-500 text-sm">
							{{ usernameTaken }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
