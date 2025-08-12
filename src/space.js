// a Space holds multiple Tasks
// a User can have multiple Spaces
export class Space {
	#id;
	#title;
	#tasks; // array of Task objects

	constructor(title) {
		this.#id = crypto.randomUUID();
		this.title = title;
		this.#tasks = []; // empty on creation
	}

	get id() {
		return this.#id;
	}

	get title() {
		return this.#title;
	}

	get tasks() {
		return [...this.#tasks]; // return a copy to prevent external mutation
	}

	set title(newTitle) {
		if (!newTitle) {
			throw new Error('Must set a Space title');
		}
		this.#title = newTitle.trim();
	}

	addTask(taskToAdd) {
		this.#tasks.push(taskToAdd);
	}

	removeTask(taskToRemove) {
		// keep only the tasks (t) that are not equal to the one we want to remove.
		this.#tasks = this.#tasks.filter((t) => t !== taskToRemove);
	}
}
