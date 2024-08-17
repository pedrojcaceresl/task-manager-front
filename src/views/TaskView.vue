<!-- TaskView.vue -->
<script setup>
import { ref } from 'vue'
import { store } from '../store/store.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Get the task ID from the route parameters
const taskId = ref(parseInt(route.params.id))
const task = ref(store.getTaskById(taskId.value))

// Function to handle task deletion
function deleteTask() {
  store.deleteTask(taskId.value)
  router.push('/tasks') // Redirect to the tasks list after deletion
}

// Function to navigate to the update page
function editTask() {
  router.push(`/tasks/edit/${taskId.value}`)
}
</script>

<template>
  <div class="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
    <h1 class="mb-4 text-3xl font-bold">{{ task?.title }}</h1>
    <p class="mb-4 text-gray-700">{{ task?.description }}</p>
    <p class="mb-2 text-sm text-gray-500">Category: <span class="font-semibold">{{ task?.category }}</span></p>
    <p class="mb-4 text-sm text-gray-500">Tags: <span class="font-semibold">{{ task?.tags.join(', ') }}</span></p>
    <div class="flex space-x-4">
      <button @click="editTask" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Edit Task
      </button>
      <button @click="deleteTask" class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
        Delete Task
      </button>
    </div>
  </div>
</template>

