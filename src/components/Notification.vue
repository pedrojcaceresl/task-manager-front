<!-- Notification.vue -->
<template>
  <div v-if="store.notification.visible" class="notification" :class="store.notification.type">
    <span>{{ store.notification.message }}</span>
    <button @click="closeNotification">X</button>
  </div>
</template>

<script>
import { store } from '../store/store.js';

export default {
  setup() {
    const closeNotification = () => {
      store.notification.visible = false;
    };

    return {
      store,
      closeNotification
    };
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  color: white;
  z-index: 50;
}

.notification.success {
  background-color: green;
}

.notification.error {
  background-color: red;
}
</style>
