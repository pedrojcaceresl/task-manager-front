<template>
  <div class="p-4 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-white">Task List</h2>
      <button
        @click="openTaskForm()"
        class="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Create New Task
      </button>
    </div>

    <div class="flex flex-wrap justify-center gap-10">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :categories="categories"
        :tags="tags"
        @edit-task="openTaskForm"
        @delete-task="handleDelete"
        @mark-complete="handleToggleComplete"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import TaskCard from './TaskCard.vue';
import { store } from '../store/store.js';
import { useRouter } from 'vue-router';

export default {
  components: {
    TaskCard,
  },
  setup() {
    const tasks = ref([]);
    const categories = ref([]);
    const tags = ref([]);
    const router = useRouter();

    // Fetch tasks on component mount
    onMounted(async () => {
      await store.getTasks();
      tasks.value = store.tasks;

      await store.getCategories();
      categories.value = store.categories;

      await store.getTags();
      tags.value = store.tags;
    });

    const openTaskForm = (taskId = null) => {
      if (taskId) {
        router.push({ name: 'EditTask', params: { id: taskId } });
      } else {
        router.push({ name: 'CreateTask' });
      }
    };

    const handleDelete = async (id) => {
      try {
        await store.deleteTask(id);
        tasks.value = tasks.value.filter(task => task.id !== id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const handleToggleComplete = async (id) => {
      try {
        await store.toggleTaskComplete(id);
        const task = tasks.value.find(task => task.id === id);
        if (task) task.status = task.status === 'completada' ? 'pendiente' : 'completada';
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    };

    return {
      tasks,
      categories,
      tags,
      openTaskForm,
      handleDelete,
      handleToggleComplete,
    };
  },
};
</script>
