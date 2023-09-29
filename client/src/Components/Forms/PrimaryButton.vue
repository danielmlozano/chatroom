<script setup lang="ts">
	interface IProps {
		disabled?: boolean
	}

	const { disabled } = defineProps<IProps>()
</script>

<template>
	<button
		:disabled="disabled"
		class="px-8 rounded-r-lg outline-none focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200 ease-in-out"
	>
		<slot />
	</button>
</template>
<style lang="scss" scoped>
	button {
		background-color: #2255ff !important;
	}
</style>
