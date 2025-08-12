import { Todo } from './todo.js';
import { Space } from './space.js';

export class TodoManager {
	#spaces;
	#todos;
	#defaultSpace;

	constructor() {
		this.#spaces = new Map(); // key: id, value: Space instance
		this.#todos = new Map(); // key: id, value: Todo instance

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

	createTodo(title, description, dueDate, priority, spaceToBeAdded) {
		// create new todo
		const todo = new Todo(title, description, dueDate, priority);
		// add it to todos collection (Map)
		this.#todos.set(todo.id, todo);

		// add the todo to a space (default or specific)
		// if user does not specify a name, add to default
		let space;
		if (spaceToBeAdded === undefined) {
			space = this.#defaultSpace;
			space.addTodo(todo);
		}
		// is user enters a name for a space, but is not yet created
		space = this.#spaces.get(spaceToBeAdded);
		if (!space) {
			// create space
			space = this.createSpace(spaceToBeAdded);
			// add todo to new space
			space.addTodo(todo);
		}
		return todo;
	}

	get spaces() {
		return Array.from(this.#spaces.values());
	}

	get todos() {
		return Array.from(this.#todos.values());
	}
}
