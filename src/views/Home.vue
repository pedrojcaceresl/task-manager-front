<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <Navbar :userName="userName" @logout="handleLogout" />

    <!-- Main content area -->
    <main class="flex-1 p-4 bg-gray-800">
      <RouterView />
    </main>
    
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, logout } from '../services/authService';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { store } from '../store/store';


export default {
  components: {
    Navbar,
    Footer
  },
  setup() {
    const user = ref(null);
    const router = useRouter();
    const userName = computed(() => store.user?.username || '');


    onMounted(async () => {
      try {
        user.value = await getCurrentUser();
      } catch (error) {
        console.error('Failed to fetch user', error);
        router.push('/login'); // Redirect to login if fetching user fails
      }
    });

    const handleLogout = async () => {
      try {
        await logout();
        router.push('/login'); // Redirect to login page after logout
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      user,
      handleLogout,
      userName
    };
  }
};
</script>
