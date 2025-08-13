// a Space holds multiple Tasks
// a User can have multiple Spaces
export class Space {
	#id;
	#name;
	#tasks; // array of Task objects

	constructor(name) {
		this.#id = crypto.randomUUID();
		this.name = name;
		this.#tasks = []; // empty on creation
	}

	get id() {
		return this.#id;
	}

	get name() {
		return this.#name;
	}

	get tasks() {
		return [...this.#tasks]; // return a copy to prevent external mutation
	}

	set name(newName) {
		if (!newName) {
			throw new Error('Must set a Space name');
		}
		this.#name = newName.trim();
	}

	addTask(taskToAdd) {
		this.#tasks.push(taskToAdd);
	}

	removeTask(taskToRemove) {
		// keep only the tasks (t) that are not equal to the one we want to remove.
		this.#tasks = this.#tasks.filter((t) => t !== taskToRemove);
	}
}
