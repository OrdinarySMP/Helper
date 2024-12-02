<script lang="ts" setup>
import { ref, onMounted } from "vue"

const route = useRoute()
const faqId = ref()
const faq = ref()

onMounted(() => {
	faqId.value = parseInt(route.params.id)
	if (!faqId.value) {
		navigateTo("/faq")
	}
	// fetch...
	faq.value = {
		id: 1,
		question: "q1",
		answer: "Test"
	}
	
})
</script>

<template>
	<div v-if="faq" class="grid grid-cols-1 gap-4">
		<div class="flex flex-col">
			<label for="question">Question:</label>
			<input
				id="question"
				v-model="faq.question"
				type="text"
			>
		</div>
		<div class="flex flex-col">
			<label for="answer">Answer:</label>
			<input
				id="answer"
				v-model="faq.answer"
				type="text"
			>
		</div>
		
	</div>
</template>