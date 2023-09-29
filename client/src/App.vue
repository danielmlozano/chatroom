<script setup lang="ts">
	import { onUnmounted, watch } from "vue"
	import { storeToRefs } from "pinia"
	import Splash from "@Pages/Splash.vue"
	import Chat from "@Pages/Chat.vue"
	import useStore from "@Composables/useStore"

	const store = useStore()

	const socket = store.socket

	const { user } = storeToRefs(store)

	watch(user, (newUser) => {}, {
		deep: true,
	})

	onUnmounted(() => {
		socket.off("connect")
	})
</script>

<template>
	<Chat v-if="user.connected" />
	<Splash v-else />
</template>
