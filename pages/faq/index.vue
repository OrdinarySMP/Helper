<script lang="ts" setup>
import { ref, onMounted } from "vue"

const faqs = ref([])


onMounted(() => {
	faqs.value = [
		{id: 1, question: "q1"},
		{id: 2, question: "q2"},
		{id: 3, question: "q3"},
		{id: 4, question: "q4"},
	]

})
	
</script>

<template>
	<table class="table-auto w-full">
		<thead>
			<tr>
				<th>ID</th>
				<th>Question</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(faq, key) in faqs" :key="key">
				<td>{{ faq.id }}</td>
				<td>{{ faq.question }}</td>
				<td>
					<NuxtLink :to="`/faq/edit/${faq.id}`">
						<button>Edit</button>
					</NuxtLink>
					<button>Delete</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>