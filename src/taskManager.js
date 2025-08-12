import { Task } from './task.js';
import { Space } from './space.js';

export class TaskManager {
	#spaces;
	#tasks;
	#defaultSpace;

	constructor() {
		this.#spaces = new Map(); // key: id, value: Space instance
		this.#tasks = new Map(); // key: id, value: Task instance

		this.#defaultSpace = new Space('default');
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
		this.#spaces.set(space.id, space);
		return space;
	}

	createTask(title, description, dueDate, priority, spaceToBeAdded) {
		// create new todo
		const todo = new Task(title, description, dueDate, priority);
		// add it to tasks collection (Map)
		this.#tasks.set(todo.id, todo);

		// add the todo to a space (default or specific)
		// if user does not specify a name, add to default
		let space;
		if (spaceToBeAdded === undefined) {
			space = this.#defaultSpace;
			space.addTask(todo);
		}
		// is user enters a name for a space, but is not yet created
		space = this.#spaces.get(spaceToBeAdded);
		if (!space) {
			// create space
			space = this.createSpace(spaceToBeAdded);
			// add todo to new space
			space.addTask(todo);
		}
		return todo;
	}

	get spaces() {
		return Array.from(this.#spaces.values());
	}

	get tasks() {
		return Array.from(this.#tasks.values());
	}
}
