import { reactive } from 'vue';
import api from '../services/api.js';
import { login as authLogin, logout as authLogout, getCurrentUser as fetchCurrentUser } from '../services/authService.js';

export const store = reactive({
    tasks: [],
    users: [],
    categories: [],
    tags: [],
    user: null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    notification: {
        visible: false,
        message: '',
        type: 'success', // 'success' or 'error'
    },

    // Method to show notifications
    showNotification(message, type = 'success') {
        this.notification.message = message;
        this.notification.type = type;
        this.notification.visible = true;

        setTimeout(() => {
            this.notification.visible = false;
        }, 5000);
    },

    // Tasks Methods
    async getTasks() {
        try {
            const response = await api.getTasks();
            this.tasks = response.data;
            console.log('Fetched tasks:', this.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            this.showNotification('Failed to fetch tasks', 'error');
        }
    },

    async getTaskById(id) {
        try {
            const response = await api.getTaskById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching task:', error);
            this.showNotification('Failed to fetch task', 'error');
        }
    },

    async addTask(task) {
        try {
            const response = await api.createTask(task);
            this.tasks.push(response.data);
            this.showNotification('Task added successfully', 'success');
        } catch (error) {
            console.error('Error adding task:', error);
            this.showNotification('Failed to add task', 'error');
        }
    },

    async updateTask(id, updatedTask) {
        try {
            const response = await api.updateTask(id, updatedTask);
            const index = this.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                this.tasks[index] = response.data;
                this.showNotification('Task updated successfully', 'success');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showNotification('Failed to update task', 'error');
        }
    },

    async deleteTask(id) {
        try {
            await api.deleteTask(id);
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.showNotification('Task deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showNotification('Failed to delete task', 'error');
        }
    },

    // Users Methods
    async getUsers() {
        try {
            const response = await api.getUsers();
            this.users = response.data;
            console.log('Fetched users:', this.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            this.showNotification('Failed to fetch users', 'error');
        }
    },

    async getUserById(id) {
        try {
            const response = await api.getUserById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            this.showNotification('Failed to fetch user', 'error');
        }
    },

    async addUser(user) {
        try {
            const response = await api.createUser(user);
            this.users.push(response.data);
            this.showNotification('User added successfully', 'success');
        } catch (error) {
            console.error('Error adding user:', error);
            this.showNotification('Failed to add user', 'error');
        }
    },

    async updateUser(id, updatedUser) {
        try {
            const response = await api.updateUser(id, updatedUser);
            const index = this.users.findIndex(user => user.id === id);
            if (index !== -1) {
                this.users[index] = response.data;
                this.showNotification('User updated successfully', 'success');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            this.showNotification('Failed to update user', 'error');
        }
    },

    async deleteUser(id) {
        try {
            await api.deleteUser(id);
            this.users = this.users.filter(user => user.id !== id);
            this.showNotification('User deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showNotification('Failed to delete user', 'error');
        }
    },

    // Categories Methods
    async getCategories() {
        try {
            const response = await api.getCategories();
            this.categories = response.data;
            console.log('Fetched categories:', this.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            this.showNotification('Failed to fetch categories', 'error');
        }
    },

    async getCategoryById(id) {
        try {
            const response = await api.getCategoryById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            this.showNotification('Failed to fetch category', 'error');
        }
    },

    async addCategory(category) {
        try {
            const response = await api.createCategory(category);
            this.categories.push(response.data);
            this.showNotification('Category added successfully', 'success');
        } catch (error) {
            console.error('Error adding category:', error);
            this.showNotification('Failed to add category', 'error');
        }
    },

    async updateCategory(id, updatedCategory) {
        try {
            const response = await api.updateCategory(id, updatedCategory);
            const index = this.categories.findIndex(category => category.id === id);
            if (index !== -1) {
                this.categories[index] = response.data;
                this.showNotification('Category updated successfully', 'success');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            this.showNotification('Failed to update category', 'error');
        }
    },

    async deleteCategory(id) {
        try {
            await api.deleteCategory(id);
            this.categories = this.categories.filter(category => category.id !== id);
            this.showNotification('Category deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showNotification('Failed to delete category', 'error');
        }
    },

    // Tags Methods
    async getTags() {
        try {
            const response = await api.getTags();
            this.tags = response.data;
            console.log('Fetched tags:', this.tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
            this.showNotification('Failed to fetch tags', 'error');
        }
    },

    async getTagById(id) {
        try {
            const response = await api.getTagById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching tag:', error);
            this.showNotification('Failed to fetch tag', 'error');
        }
    },

    async addTag(tag) {
        try {
            const response = await api.createTag(tag);
            this.tags.push(response.data);
            this.showNotification('Tag added successfully', 'success');
        } catch (error) {
            console.error('Error adding tag:', error);
            this.showNotification('Failed to add tag', 'error');
        }
    },

    async updateTag(id, updatedTag) {
        try {
            const response = await api.updateTag(id, updatedTag);
            const index = this.tags.findIndex(tag => tag.id === id);
            if (index !== -1) {
                this.tags[index] = response.data;
                this.showNotification('Tag updated successfully', 'success');
            }
        } catch (error) {
            console.error('Error updating tag:', error);
            this.showNotification('Failed to update tag', 'error');
        }
    },

    async deleteTag(id) {
        try {
            await api.deleteTag(id);
            this.tags = this.tags.filter(tag => tag.id !== id);
            this.showNotification('Tag deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting tag:', error);
            this.showNotification('Failed to delete tag', 'error');
        }
    },

    // Authentication Methods
    async login(credentials) {
        try {
            const userData = await authLogin(credentials);
            this.user = await fetchCurrentUser();
            this.isAuthenticated = true;
            this.showNotification('Logged in successfully', 'success');
        } catch (error) {
            this.logout(); // Ensure state is clean on failure
            console.error('Login failed:', error);
            this.showNotification('Login failed', 'error');
            throw error;
        }
    },

    logout() {
        authLogout();
        this.user = null;
        this.isAuthenticated = false;
        this.showNotification('Logged out successfully', 'success');
    },

    async fetchUser() {
        try {
            const user = await fetchCurrentUser();
            this.user = user;
            this.isAuthenticated = true;
        } catch (error) {
            this.logout();
            console.error('Fetching user failed:', error);
            this.showNotification('Failed to fetch user', 'error');
        }
    },

    // Increment count (example)
    count: 0,
    incrementCount() {
        this.count++;
    }
});
