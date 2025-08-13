import { TaskManager } from './taskManager.js';

export class Dom {
	#taskManager;

	constructor(taskManager) {
		this.#taskManager = taskManager;
		// from input
		this.taskForm = document.querySelector('#task__form');
		this.taskTitleInput = document.querySelector('#task__title');
		this.taskDescriptionInput = document.querySelector('#task__description');
		this.taskDueDateInput = document.querySelector('#task__dueDate');
		this.taskPriorityInput = document.querySelector('#task__priority');
		this.taskSpaceInput = document.querySelector('#task__space');

		// spaces
		this.spacesList = document.querySelectorAll('.spaces__list');

		this.#bindEvents();
		this.renderSpaces();
	}

	#bindEvents() {
		this.taskForm.addEventListener('submit', (e) => {
			e.preventDefault();
			// get input values and create task
			const title = this.taskTitleInput.value.trim();
			const description = this.taskDescriptionInput.value.trim();
			const dueDateString = this.taskDueDateInput.value;
			const priority = this.taskPriorityInput.value;
			const spaceToBeAdded = this.taskSpaceInput.value.trim();

			// convert date string from input, to a date object
			const dueDate = dueDateString ? new Date(dueDateString) : new Date();

			const task = this.#taskManager.createTask(
				title,
				description,
				dueDate,
				priority,
				spaceToBeAdded || undefined
			);

			// For now (test): log collections to verify it worked
			console.log('Created task:', task);
			console.log('All tasks:', this.#taskManager.tasks);
			console.log(
				'Spaces:',
				this.#taskManager.spaces.map((s) => ({
					title: s.name,
					tasks: s.tasks.length,
				}))
			);

			// Update DOM
			this.taskForm.reset();
			this.renderSpaces(); // for newly created spaces
		});
	}
	renderSpaces() {
		const spaces = this.#taskManager.spaces;

		this.spacesList.forEach((node) => {
			// clear
			node.innerHTML = '';

			// FORM: add spaces options to datalist
			if (node.tagName === 'DATALIST') {
				spaces.forEach((space) => {
					const option = document.createElement('option');
					option.value = space.name;
					node.appendChild(option);
				});
				return;
			}

			// NAVBAR: add spaces li>a to UL
			if (node.tagName === 'UL') {
				spaces.forEach((space) => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.textContent = space.name;
					li.appendChild(a);
					node.appendChild(li);
				});
			}
		});
	}
}
