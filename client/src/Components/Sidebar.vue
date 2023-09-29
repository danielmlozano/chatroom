<script setup lang="ts">
	import { storeToRefs } from "pinia"
	import useStore from "@/Composables/useStore"

	const store = useStore()
	const { connectedUsers } = storeToRefs(store)
</script>
<template>
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
						<p class="text-sm font-medium text-gray-200">
							{{ user.username }}
						</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
