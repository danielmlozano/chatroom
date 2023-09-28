<script setup lang="ts">
	import { onMounted, onUnmounted, watch } from "vue"
	import { storeToRefs } from "pinia"
	import Splash from "@Pages/Splash.vue"
	import useStore from "@Composables/useStore"

	const store = useStore()

	const socket = store.socket

	const { user } = storeToRefs(store)

	watch(
		user,
		(newUser) => {
			console.log(newUser)
		},
		{
			deep: true,
		},
	)

	onMounted(() => {
		console.log(user.value)
		socket.on("connect", () => {
			console.log("connected")
		})
	})

	onUnmounted(() => {
		socket.off("connect")
	})
</script>

<template>
	<Splash />
</template>
