


<script>
    import { ref } from 'vue';
    import { store } from '../store/store.js';

    const newTask = ref({ id: Date.now(), title: '', description: '', category: '', tags: []})

    function addNewTask() {
        store.addTask({ ...newTask.value});
        newTask.value = { id: Date.now(), title: '', description: '', category: '', tags: []}
    }
</script>


<template>
  <div class="max-w-md p-4 mx-auto bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-2xl font-bold">Add New Task</h2>
    <input v-model="newTask.title" class="w-full p-2 mb-2 border border-gray-300 rounded" placeholder="Task Title" />
    <input v-model="newTask.description" class="w-full p-2 mb-2 border border-gray-300 rounded" placeholder="Task Description" />
    <input v-model="newTask.category" class="w-full p-2 mb-2 border border-gray-300 rounded" placeholder="Category" />
    <input v-model="newTask.tags" class="w-full p-2 mb-4 border border-gray-300 rounded" placeholder="Tags (comma-separated)" />
    <button @click="addNewTask" class="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Add Task</button>
  </div>
</template>
