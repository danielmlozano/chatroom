<script setup lang="ts">
	import { ref, computed, onMounted } from "vue"
	import useStore from "@Composables/useStore"
	import SplashIcon from "@Components/Icons/SplashIcon.vue"
	import { PrimaryButton, TextInput } from "@Forms"

	const username = ref("daniel")

	const canJoin = computed<boolean>(() => {
		return !!username.value
	})

	const { socket, setUser } = useStore()

	const joinChat = async (): Promise<void> => {
		await socket.connect()
		socket.emit("join", JSON.stringify({ username: username.value }))
	}

	socket.on("joined", () => {
		setUser({
			username: username.value,
			connected: true,
		})
	})
</script>
<template>
	<div class="h-screen flex">
		<div class="bg-white w-full lg:w-1/2">
			<div class="flex flex-col items-center justify-center h-full">
				<SplashIcon class="w-1/2" />
				<h1 class="text-3xl font-bold text-gray-800">
					Welcome to <span class="text-blue-500">our Chatroom</span>
				</h1>
			</div>
		</div>
		<div class="w-full lg:w-1/2 flex items-center">
			<div class="w-3/4 mx-auto">
				<h1 class="text-xl text-gray-100">
					Please enter your username to continue
				</h1>
				<div class="flex mt-4">
					<form class="flex mt-4 w-full" @submit.prevent="joinChat">
						<TextInput
							v-model="username"
							placeholder="Username"
							@key-enter="joinChat"
						/>
						<PrimaryButton :disabled="!canJoin" type="submit">
							Join
						</PrimaryButton>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
