<template>
    <div class="max-w-md p-6 mx-auto bg-gray-800 rounded-lg">
        <h2 class="mb-4 text-xl font-bold text-white">
            {{ isEditing ? "Edit Task" : "Create Task" }}
        </h2>

        <form @submit.prevent="handleSubmit">
            <!-- Title -->
            <div class="mb-4">
                <label for="title" class="block mb-1 text-sm font-semibold text-gray-400">Title</label>
                <input
                    id="title"
                    v-model="formData.title"
                    type="text"
                    class="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <!-- Description -->
            <div class="mb-4">
                <label for="description" class="block mb-1 text-sm font-semibold text-gray-400">Description</label>
                <textarea
                    id="description"
                    v-model="formData.description"
                    class="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                ></textarea>
            </div>

            <!-- Category Select -->
            <div class="mb-4">
                <label for="category" class="block mb-1 text-sm font-semibold text-gray-400">Category</label>
                <div class="relative">
                    <select
                        id="category"
                        v-model="formData.category_id"
                        class="w-full px-3 py-2 pr-10 text-white bg-gray-700 border border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg
                            class="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Tags -->
            <div class="mb-4">
                <label class="block mb-1 text-sm font-semibold text-gray-400">Tags</label>
                <div class="flex flex-wrap gap-2">
                    <div v-for="tag in tags" :key="tag.id" class="flex items-center">
                        <input
                            type="checkbox"
                            :id="'tag-' + tag.id"
                            :value="tag.id"
                            v-model="selectedTagIds"
                            class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label :for="'tag-' + tag.id" class="ml-2 text-sm text-gray-300">
                            {{ tag.name }}
                        </label>
                    </div>
                </div>
            </div>

            <!-- Priority -->
            <div class="mb-4">
                <label class="block mb-1 text-sm font-semibold text-gray-400">Priority</label>
                <div class="flex space-x-4">
                    <label class="flex items-center text-sm text-gray-400">
                        <input
                            type="radio"
                            v-model="formData.priority"
                            value="alta"
                            required
                            class="text-blue-500 form-radio"
                        />
                        <span class="ml-2">High</span>
                    </label>
                    <label class="flex items-center text-sm text-gray-400">
                        <input
                            type="radio"
                            v-model="formData.priority"
                            value="media"
                            required
                            class="text-blue-500 form-radio"
                        />
                        <span class="ml-2">Medium</span>
                    </label>
                    <label class="flex items-center text-sm text-gray-400">
                        <input
                            type="radio"
                            v-model="formData.priority"
                            value="baja"
                            required
                            class="text-blue-500 form-radio"
                        />
                        <span class="ml-2">Low</span>
                    </label>
                </div>
            </div>

            <!-- Due Date -->
            <div class="mb-4">
                <label for="due_date" class="block mb-1 text-sm font-semibold text-gray-400">Due Date</label>
                <input
                    id="due_date"
                    v-model="formData.due_date"
                    type="date"
                    class="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end gap-2">
                <button
                    @click="handleCancel"
                    type="button"
                    class="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {{ isEditing ? "Update Task" : "Create Task" }}
                </button>
                
            </div>
        </form>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { store } from "../store/store.js";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

export default {
    components: { Multiselect },
    props: {
        task: {
            type: Object,
            default: () => ({
                title: "",
                description: "",
                category_id: null,
                tag_ids: [],
                priority: "media",
                due_date: "",
            }),
        },
    },
    setup(props, { emit }) {
        const formData = ref({ ...props.task });
        const isEditing = ref(false);
        const route = useRoute();
        const router = useRouter();
        const categories = ref([]);
        const tags = ref([]);

        const selectedTagIds = computed({
            get: () => formData.value.tag_ids,
            set: (value) => {
                formData.value.tag_ids = value;
            },
        });

        onMounted(async () => {
            const taskId = route.params.id;
            if (taskId) {
                isEditing.value = true;
                const task = await store.getTaskById(taskId);
                formData.value = {
                    ...task,
                    category_id: task.category ? task.category.id : null,
                    tag_ids: task.tags.map(tag => tag.id),
                };
            } else {
                isEditing.value = false;
            }

            await store.getCategories();
            categories.value = store.categories;

            await store.getTags();
            tags.value = store.tags;
        });

        watch(
            () => props.task,
            (newTask) => {
                formData.value = {
                    ...newTask,
                    category_id: newTask.category ? newTask.category.id : null,
                    tag_ids: newTask.tags.map(tag => tag.id),
                };
                isEditing.value = !!newTask.id;
            }
        );

        const handleSubmit = async () => {
            try {
                const payload = {
                    title: formData.value.title,
                    description: formData.value.description,
                    status: formData.value.status, // or any status you want
                    priority: formData.value.priority,
                    due_date: formData.value.due_date,
                    category_id: formData.value.category_id,
                    tag_ids: formData.value.tag_ids,
                };

                if (isEditing.value) {
                    await store.updateTask(formData.value.id, payload);
                } else {
                    await store.addTask(payload);
                }
                router.push('/');
            } catch (error) {
                console.error('Error updating or creating task:', error);
            }
        };

        const handleCancel = () => {
            router.push("/");
        }

        return {
            categories,
            formData,
            handleCancel,
            handleSubmit,
            isEditing,
            selectedTagIds,
            tags,
        };
    },
};
</script>
