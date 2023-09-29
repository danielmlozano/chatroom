<script setup lang="ts">
	import { ref, onMounted, watch } from "vue"
	import useStore from "@Composables/useStore"
	import { storeToRefs } from "pinia"

	const emit = defineEmits(["goTo", "clear"])
	const store = useStore()

	const { searchResults } = storeToRefs(store)

	const currentResultIndex = ref<number>(searchResults.value.length - 1)

	watch(
		() => searchResults.value,
		() => {
			currentResultIndex.value = searchResults.value.length - 1
		},
	)

	const nextResult = (): void => {
		if (currentResultIndex.value === searchResults.value.length - 1) {
			currentResultIndex.value = 0
			return
		}

		currentResultIndex.value++

		emit("goTo", searchResults.value[currentResultIndex.value])
	}

	const previousResult = (): void => {
		if (currentResultIndex.value === 0) {
			currentResultIndex.value = searchResults.value.length - 1
			return
		}

		currentResultIndex.value--

		emit("goTo", searchResults.value[currentResultIndex.value])
	}

	const clearSearch = (): void => {
		emit("clear")
	}

	onMounted(() => {
		emit("goTo", searchResults.value[currentResultIndex.value])
	})
</script>
<template>
	<div class="flex items-center justify-center w-96">
		<span
			class="text-gray-500 text-sm font-medium block w-full text-center"
		>
			{{ `Message ${currentResultIndex + 1} of ${searchResults.length}` }}
		</span>
		<button
			class="ml-5 bg-blue-300 px-4 py-2 rounded-md text-white hover:bg-blue-400 text-sm disabled:bg-gray-300"
			:disabled="currentResultIndex === 0"
			@click="previousResult"
		>
			&larr;
		</button>
		<button
			class="ml-5 bg-blue-300 px-4 py-2 rounded-md text-white hover:bg-blue-400 text-sm disabled:bg-gray-300"
			:disabled="currentResultIndex === searchResults.length - 1"
			@click="nextResult"
		>
			&rarr;
		</button>
		<button
			class="ml-5 bg-blue-300 px-4 py-2 rounded-md text-white hover:bg-blue-400 disabled:bg-gray-300 text-xs"
			@click="clearSearch"
		>
			Clear search
		</button>
	</div>
</template>
