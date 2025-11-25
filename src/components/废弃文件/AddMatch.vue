<!-- 新增配伍页面 src/pages/AddMatch.vue -->
<template>
	<div class="add-match">
		<h2>新增配伍</h2>
		<AddMatchForm />
	</div>
</template>

<script setup>
	import AddMatchForm from '../components/AddMatchForm.vue';
</script>

<style scoped>
	.add-match {
		padding: 20px;
	}
</style>