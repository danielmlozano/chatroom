<script setup>
	import { ref, computed } from "vue"
	import Splash from "./Components/Icons/Splash.vue"

	const username = ref("")

	const canJoin = computed(() => {
		return !!username.value
	})
</script>

<template>
	<div class="h-screen flex">
		<div class="bg-white w-full lg:w-1/2">
			<div class="flex flex-col items-center justify-center h-full">
				<Splash class="w-1/2" />
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
					<form class="flex mt-4 w-full">
						<input
							type="text"
							v-model="username"
							@keyup.enter="joinChat"
							class="rounded-l-lg p-4 w-full bg-gray-100 outline-none text-gray-800 placeholder-gray-600"
							placeholder="Username"
						/>
						<button
							@click="joinChat"
							:disabled="!canJoin"
							class="px-8 rounded-r-lg outline-none focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200 ease-in-out"
						>
							Join
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	button {
		background-color: #2255ff;
	}
</style>
