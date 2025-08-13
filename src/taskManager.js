import { Task } from './task.js';
import { Space } from './space.js';

export class TaskManager {
	#spaces;
	#tasks;
	#defaultSpace;

	constructor() {
		this.#spaces = new Map(); // key: name, value: Space instance
		this.#tasks = new Map(); // key: id, value: Task instance

		this.#defaultSpace = new Space('Others');
		this.#spaces.set(this.#defaultSpace.name, this.#defaultSpace);
	}

	createSpace(name) {
		// check if the name is available
		if (this.#spaces.has(name)) {
			throw new Error(`Space ${name} already exists.`);
		}
		// if available, create a new space
		const space = new Space(name);
		// add the new space to the spaces collection (Map)
		this.#spaces.set(space.name, space);
		return space;
	}

	createTask(title, description, dueDate, priority, spaceToBeAdded) {
		// create new task
		const task = new Task(title, description, dueDate, priority);
		// add it to tasks collection (Map)
		this.#tasks.set(task.id, task);

		// add the task to a space (default or specific)
		// if user does not specify a name, add to default
		let space;
		if (spaceToBeAdded === undefined) {
			space = this.#defaultSpace;
		} else {
			spaceToBeAdded = capitalize(spaceToBeAdded);
			// if space exist, add to existing space, otherwise create new space
			space =
				this.#spaces.get(spaceToBeAdded) || this.createSpace(spaceToBeAdded);
		}

		function capitalize(str) {
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		}

		space.addTask(task);
		return task;
	}

	get spaces() {
		return Array.from(this.#spaces.values());
	}

	get tasks() {
		return Array.from(this.#tasks.values());
	}
}
