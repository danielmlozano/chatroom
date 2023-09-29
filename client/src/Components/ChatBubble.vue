<script setup lang="ts">
	import { IMessage } from "@/Interfaces"
	import useStore from "@Composables/useStore"

	const { user } = useStore()

	interface IProps {
		message: IMessage
	}

	const { message } = defineProps<IProps>()

	const isIncomingMessage = (message: IMessage): boolean => {
		return message.username !== user.username
	}
</script>
<template>
	<template v-if="isIncomingMessage(message)">
		<!-- Incoming message bubble -->
		<div class="flex flex-col w-full items-start space-y-1">
			<div class="flex items-center space-x-2">
				<img
					src="https://via.placeholder.com/32"
					alt="User Avatar"
					class="w-6 h-6 rounded-full"
				/>
				<span class="text-sm font-medium text-gray-700 mb-2">{{
					message.username
				}}</span>
			</div>
			<div class="bg-gray-100 rounded-lg p-2">
				<p class="text-sm text-gray-800">
					{{ message.message }}
				</p>
			</div>
		</div>
	</template>
	<template v-else>
		<div class="flex flex-col w-full items-end space-y-1">
			<div class="bg-blue-500 rounded-lg p-2">
				<p class="text-sm text-white">
					{{ message.message }}
				</p>
			</div>
		</div>
	</template>
</template>
