<template>
  <nav class="flex items-center justify-between p-4 bg-gray-900">
    <div class="text-xl font-semibold text-white">
      TaskManager
    </div>
    <div class="flex items-center">
      <span class="mr-4 text-white">Hello, {{ userName }}</span>
      <button @click="handleLogout" class="px-4 py-2 text-white transition duration-300 bg-red-500 rounded hover:bg-red-700">
        Logout
      </button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import { logout } from '../services/authService'; // Import the logout function

export default {
  props: {
    userName: {
      type: String,
      required: true,
    }
  },
  setup() {
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await logout(); // Call the logout function
        router.push("/login"); // Redirect to login page
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      handleLogout
    };
  }
};
</script>
