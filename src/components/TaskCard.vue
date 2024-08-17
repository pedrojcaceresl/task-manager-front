<template>
  <div class="relative w-full max-w-md p-4 mb-4 text-white bg-gray-900 rounded-lg shadow-md">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">{{ task.title }}</h2>
      <div class="flex space-x-2">
        <button @click="editTask" class="p-2 bg-blue-500 rounded-full hover:bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5 5v-5h5zM14.5 5.5a2.121 2.121 0 112.993 2.993L8 18H5v-3L14.5 5.5z" />
          </svg>
        </button>
        <button @click="deleteTask" class="p-2 bg-red-500 rounded-full hover:bg-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- <button @click="markComplete" class="p-2 bg-green-500 rounded-full hover:bg-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button> -->
      </div>
    </div>
    <p class="mt-2 text-sm text-gray-400">{{ task.description }}</p>
    <div class="flex items-center justify-between mt-4">
      <span :class="priorityClass">{{ task.priority }}</span>
      <span class="text-xs text-gray-400">{{ formattedDate }}</span>
    </div>
    <div class="flex items-center justify-between mt-2">
      <div class="flex flex-wrap space-x-2">
        <span v-for="tag in task.tags" :key="tag.id" :class="getTagClass(tag.id)" class="px-2 py-1 text-xs rounded-full">{{ tag.name }}</span>
        <span :class="categoryClass">{{ task.category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  computed: {
    priorityClass() {
      return {
        'text-red-500': this.task.priority === 'alta',
        'text-yellow-500': this.task.priority === 'media',
        'text-green-500': this.task.priority === 'baja',
      };
    },
    formattedDate() {
      // Convert the date to a local date string using date-fns
      const date = parseISO(this.task.due_date);
      return format(date, 'MMM d, yyyy'); // Adjust the format as needed
    },
    categoryClass() {
      // Assuming each category has a `colorClass` attribute to style the category
      const colorClass = this.task.category.colorClass || 'bg-gray-700';
      return `${colorClass} text-white text-xs px-2 py-1 rounded-full`;
    },
  },
  methods: {
    editTask() {
      this.$emit('edit-task', this.task.id);
    },
    deleteTask() {
      this.$emit('delete-task', this.task.id);
    },
    markComplete() {
      this.$emit('mark-complete', this.task.id);
    },
    getTagClass(tagId) {
      // Assign different colors to tags
      const tagColors = ['bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-green-500'];
      const index = tagId % tagColors.length;
      return tagColors[index] + ' text-white';
    }
  },
};
</script>
