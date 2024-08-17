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

		<div class="flex flex-wrap justify-center gap-10 ">
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
<!-- Spinner -->
  <div v-if="!tasks.length > 0" class="flex flex-col items-center justify-center h-full gap-3">
    <h1 class="text-white">Loading...</h1>
    			<svg
				width="38"
				height="38"
				viewBox="0 0 38 38"
				xmlns="http://www.w3.org/2000/svg"
				stroke="#fff"
			>
				<g fill="none" fill-rule="evenodd">
					<g transform="translate(1 1)" stroke-width="2">
						<circle stroke-opacity=".5" cx="18" cy="18" r="18" />
						<path d="M36 18c0-9.94-8.06-18-18-18">
							<animateTransform
								attributeName="transform"
								type="rotate"
								from="0 18 18"
								to="360 18 18"
								dur="1s"
								repeatCount="indefinite"
							/>
						</path>
					</g>
				</g>
			</svg>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import TaskCard from "./TaskCard.vue";
import { store } from "../store/store.js";
import { useRouter } from "vue-router";

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
				router.push({ name: "EditTask", params: { id: taskId } });
			} else {
				router.push({ name: "CreateTask" });
			}
		};

		const handleDelete = async (id) => {
			try {
				await store.deleteTask(id);
				tasks.value = tasks.value.filter((task) => task.id !== id);
			} catch (error) {
				console.error("Error deleting task:", error);
			}
		};

		const handleToggleComplete = async (id) => {
			try {
				await store.toggleTaskComplete(id);
				const task = tasks.value.find((task) => task.id === id);
				if (task)
					task.status =
						task.status === "completada"
							? "pendiente"
							: "completada";
			} catch (error) {
				console.error("Error toggling task completion:", error);
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
