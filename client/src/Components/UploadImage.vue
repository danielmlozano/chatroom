<script setup lang="ts">
	import { ref } from "vue"
	import ImageIcon from "@Components/Icons/ImageIcon.vue"
	import useStore from "@Composables/useStore"

	const selectedFile = ref<File | null>(null)
	const imageUrl = ref<string | null>(null)

	const emit = defineEmits(["uploaded"])

	const store = useStore()

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		if (target.files && target.files.length > 0) {
			selectedFile.value = target.files[0]
			uploadImage()
		}
	}

	const uploadImage = async () => {
		if (!selectedFile.value) {
			return alert("Please select an image to upload.")
		}

		const formData = new FormData()
		formData.append("file", selectedFile.value)

		// append username
		const username = store.user.username

		if (!username) {
			return alert("Please login to upload an image.")
		}

		formData.append("username", username)

		const apiUrl = (import.meta as any).env.VITE_API_URL as string

		try {
			const response = await fetch(`${apiUrl}/messages/upload`, {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error("Image upload failed.")
			}

			const data = await response.json()

			emit("uploaded", data.imageUrl)
		} catch (error) {
			console.error(error)
			alert("Image upload failed.")
		}
	}
</script>
<template>
	<div>
		<label
			for="fileInput"
			class="cursor-pointer block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
		>
			<ImageIcon class="w-10 h-10 fill-white" />
		</label>
		<input
			id="fileInput"
			type="file"
			ref="fileInput"
			class="hidden"
			@change="handleFileChange"
			accept="image/*"
		/>
		<div v-if="imageUrl">
			<img :src="imageUrl" alt="Uploaded Image" class="mt-4 max-w-md" />
		</div>
	</div>
</template>
