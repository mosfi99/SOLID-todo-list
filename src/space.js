// a Space holds multiple Todos
// a User can have multiple Spaces
export class Space {
	#id;
	#title;
	#todos; // array of Todo objects

	constructor(title) {
		this.#id = crypto.randomUUID();
		this.title = title;
		this.#todos = []; // empty on creation
	}

	get id() {
		return this.#id;
	}

	get title() {
		return this.#title;
	}

	get todos() {
		return [...this.#todos]; // return a copy to prevent external mutation
	}

	set title(newTitle) {
		if (!newTitle) {
			throw new Error('Must set a Space title');
		}
		this.#title = newTitle.trim();
	}

	addTodo(todoToAdd) {
		this.#todos.push(todoToAdd);
	}

	removeTodo(todoToRemove) {
		// keep only the todos (t) that are not equal to the one we want to remove.
		this.#todos = this.#todos.filter((t) => t !== todoToRemove);
	}
}
