<script setup lang="ts">
	import { ref } from "vue"
	import { PrimaryButton, TextInput } from "@Forms"
	import { apiFetch } from "@Composables/useForm"
	import useStore from "@Composables/useStore"
	import { storeToRefs } from "pinia"

	const emit = defineEmits(["noResults"])

	const store = useStore()

	const { searchQuery } = storeToRefs(store)

	const search = async () => {
		const response = await apiFetch(
			`/messages/search?query=${searchQuery.value}`,
		)
		if (!response.length) {
			emit("noResults")
			store.setSearchNoResults()
			return
		}
		store.setSearchResults(response)
	}
</script>
<template>
	<div class="my-3">
		<span class="text-blue-200 text-sm font-bold">Search message</span>
		<form class="flex mt-4 w-full" @submit.prevent="search">
			<TextInput
				placeholder="Search message"
				class="placeholder-gray-500 h-10 text-xs"
				v-model="searchQuery"
			/>
			<PrimaryButton type="submit" class="!text-xs !px-2 text-center">
				Search
			</PrimaryButton>
		</form>
	</div>
</template>
