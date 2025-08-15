import { TaskManager } from './taskManager.js';

export class Dom {
	#taskManager;
	#currentSpace;

	constructor(taskManager) {
		this.#taskManager = taskManager;
		this.#currentSpace = taskManager.defaultSpace;
		this.taskModal = document.querySelector('#modal');
		this.taskForm = document.querySelector('#task__form');
		// form input
		this.taskTitleInput = document.querySelector('#task__title');
		this.taskDescriptionInput = document.querySelector('#task__description');
		this.taskDueDateInput = document.querySelector('#task__dueDate');
		this.taskPriorityInput = document.querySelector('#task__priority');
		this.taskSpaceInput = document.querySelector('#task__space');

		// spaces
		this.spacesList = document.querySelectorAll('.spaces__list');

		// content
		this.content = document.querySelector('#content');

		this.#bindEvents();
		this.renderSpacesList();
		this.renderSpace(this.#currentSpace);
	}

	#bindEvents() {
		// add task
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

			// Update DOM
			this.taskForm.reset();
			this.renderSpacesList(); // for newly created spaces

			// re-render current space if it exists to show new task
			if (this.#currentSpace) {
				this.renderSpace(this.#currentSpace);
			}

			this.taskModal.close();
		});

		// select space with event delegation
		this.spacesList.forEach((node) => {
			if (node.tagName === 'UL') {
				node.addEventListener('click', (e) => {
					if (e.target.tagName === 'A') {
						e.preventDefault();
						const spaceName = e.target.textContent;
						this.selectSpace(spaceName);
					}
				});
			}
		});

		// delete task
		this.content.addEventListener('click', (e) => {
			if (e.target.classList.contains('btn-delete')) {
				e.preventDefault();
				const taskId = e.target.dataset.taskId;
				this.deleteTaskDOM(taskId);
			}
		});
	}

	selectSpace(spaceName) {
		const space = this.#taskManager.spaces.find((s) => s.name === spaceName);
		if (space) {
			this.#currentSpace = space;
			this.renderSpace(space);
		}
	}

	renderSpace(space) {
		// clear content
		this.content.innerHTML = '';

		// create space header
		const spaceHeader = document.createElement('div');
        spaceHeader.classList = 'my-4 text-left'
		spaceHeader.innerHTML = `
			<h2 class='text-xl font-bold' >${space.name}</h2>
			<p>Tasks: ${space.tasks.length}</p>
		`;
		this.content.appendChild(spaceHeader);

		// create tasks container
		const tasksContainer = document.createElement('div');
		tasksContainer.classList = `flex flex-col md:flex-row flex-wrap gap-3 items-start`;

		if (space.tasks.length === 0) {
			tasksContainer.innerHTML =
				'<p class="no-tasks">No tasks in this space yet.</p>';
		} else {
			space.tasks.forEach((task) => {
				const taskElement = this.#createTaskElement(task);
				tasksContainer.appendChild(taskElement);
			});
		}

		this.content.appendChild(tasksContainer);
	}

	#createTaskElement(task) {
		const taskDiv = document.createElement('div');
		taskDiv.className = 'card card-border border-primary bg-base-300 w-60';
		taskDiv.dataset.taskId = task.id;

		const dueDateFormatted = task.dueDate.toLocaleDateString();

		taskDiv.innerHTML = `
			<div class="card-body">
                <div class="card-actions justify-end">
                    <div class="badge badge-soft">Priority: ${task.priority}</div> 
                </div>
				<h3 class="card-title break-words">${task.title}</h3>
				<p class="description break-words">${task.description}</p>
				<p>Due: ${dueDateFormatted}</p>
                <div class="card-actions justify-end">
    				<button class="btn btn-sm btn-outline btn-secondary btn-delete" data-task-id="${task.id}">Delete</button>
                </div>
            </div>
		`;

		return taskDiv;
	}

	renderSpacesList() {
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
					a.id = `space__${space.name.replace(/\s+/g, '')}`;
					a.href = '#'; // accessibility
					li.appendChild(a);
					node.appendChild(li);
				});

				// re-bind click events after re-rendering
				this.#bindSpaceClickEvents(node);
			}
		});
	}
	#bindSpaceClickEvents(ulElement) {
		ulElement.addEventListener('click', (e) => {
			if (e.target.tagName === 'A') {
				e.preventDefault();
				const spaceName = e.target.textContent;
				this.selectSpace(spaceName);
			}
		});
	}

	deleteTaskDOM(taskId) {
		// taskManager's deleteTask method
		const success = this.#taskManager.deleteTask(taskId);

		if (success) {
			// re-render the current space to reflect changes
			if (this.#currentSpace) {
				// update the current space reference since the space's tasks have changed
				const updatedSpace = this.#taskManager.spaces.find(
					(s) => s.name === this.#currentSpace.name
				);
				if (updatedSpace) {
					this.#currentSpace = updatedSpace;
					this.renderSpace(this.#currentSpace);
				}
			}
		} else {
			console.error('Failed to delete task:', taskId);
		}
	}

	// public method to get current space
	getCurrentSpace() {
		return this.#currentSpace;
	}
}
