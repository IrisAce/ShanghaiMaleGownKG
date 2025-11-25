<!-- 新增款式页面 src/pages/AddStyle.vue -->
<template>
	<div class="add-style">
		<h2>新增款式</h2>
		<AddStyleForm />
	</div>
</template>

<script setup>
	import AddStyleForm from '../components/AddStyleForm.vue';
</script>

<style scoped>
	.add-style {
		padding: 20px;
	}
</style>