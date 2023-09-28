<script setup lang="ts">
	import { defineEmits } from "vue"

	interface IProps {
		disabled?: boolean
		modelValue: string
		placeholder?: string
	}

	const emit = defineEmits(["update:modelValue", "keyEnter"])

	const {
		disabled = false,
		modelValue,
		placeholder = "",
	} = defineProps<IProps>()

	const updateModelValue = (event: Event) => {
		const value = (event.target as HTMLInputElement).value
		emit("update:modelValue", value)
	}
</script>
<template>
	<input
		type="text"
		@input="updateModelValue"
		:value="modelValue"
		class="rounded-l-lg p-4 w-full bg-gray-100 outline-none text-gray-800 placeholder-gray-600"
		:placeholder="placeholder"
		:disabled="disabled"
		@keyup.enter="emit('keyEnter')"
	/>
</template>
