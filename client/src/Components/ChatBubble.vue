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

	const friendlyDate = (date: string): string => {
		const dateObject = new Date(date)
		const today = new Date()

		const isToday =
			dateObject.getDate() === today.getDate() &&
			dateObject.getMonth() === today.getMonth() &&
			dateObject.getFullYear() === today.getFullYear()

		const options = isToday
			? { hour: "numeric", minute: "numeric" }
			: { year: "numeric", month: "short", day: "numeric" }

		return dateObject.toLocaleString("en-US", options)
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
				<a
					:href="message.fileUrl"
					v-if="message.fileUrl"
					target="_blank"
				>
					<img :src="message.fileUrl" class="max-w-3xl" />
				</a>
				<p class="text-sm text-gray-800" v-else>
					{{ message.message }}
				</p>
			</div>

			<div class="text-xs text-gray-500">
				{{ friendlyDate(message.createdAt) }}
			</div>
		</div>
	</template>
	<template v-else>
		<div class="flex flex-col w-full items-end space-y-1">
			<div class="bg-blue-500 rounded-lg p-2">
				<a
					:href="message.fileUrl"
					v-if="message.fileUrl"
					target="_blank"
				>
					<img
						:src="message.fileUrl"
						class="w-64 h-64 object-cover"
					/>
				</a>
				<p class="text-sm text-white" v-else>
					{{ message.message }}
				</p>
			</div>
		</div>
	</template>
</template>
