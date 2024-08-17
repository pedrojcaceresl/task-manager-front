<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-800">
    <div class="w-full max-w-sm p-8 bg-gray-900 rounded-lg shadow-lg">
      <h1 class="mb-6 text-2xl font-semibold text-center text-white">
        Sign In
      </h1>
      <form @submit.prevent="handleLogin">
  <div class="mb-4">
    <label for="username" class="block mb-2 text-white">Username</label>
    <input
      type="text"
      id="username"
      v-model="username"
      class="w-full p-2 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your username"
      required
    />
  </div>
  <div class="mb-6">
    <label for="password" class="block mb-2 text-white">Password</label>
    <input
      type="password"
      id="password"
      v-model="password"
      class="w-full p-2 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your password"
      required
    />
  </div>
  <p v-if="loginError" class="mb-4 text-red-500">{{ loginError }}</p> <!-- Display error message -->
  <button
    type="submit"
    class="w-full py-2 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
  >
    Login
  </button>
</form>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store/store.js';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const loginError = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      try {
        await store.login({ username: username.value, password: password.value });
        router.push('/');
      } catch (error) {
        loginError.value = 'Invalid username or password. Please try again.'; // Set error message
        console.error('Login error:', error);
      }
    };

    return {
      username,
      password,
      loginError, // Return the loginError variable to use it in the template
      handleLogin
    };
  }
};
</script>
