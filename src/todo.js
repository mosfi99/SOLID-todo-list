// a Todo belongs to only one Space
export class Todo {
	#id;
	#title;
	#description;
	#dueDate;
	#priority;
	static PRIORITIES = ['low', 'medium', 'high'];

	constructor(title, description, dueDate, priority) {
		this.#id = crypto.randomUUID();
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
	}

	get id() {
		return this.#id;
	}

	get title() {
		return this.#title;
	}

	get description() {
		return this.#description;
	}

	get dueDate() {
		return this.#dueDate;
	}

	get priority() {
		return this.#priority;
	}

	set title(newTitle) {
		if (!newTitle) {
			throw new Error('Must set a title');
		}
		this.#title = newTitle.trim();
	}

	set description(newDescription) {
		this.#description = newDescription?.trim() ?? ''; // optional
	}

	set dueDate(newDueDate) {
		if (!(newDueDate instanceof Date)) {
			throw new Error('dueDate must be a Date object');
		}
		this.#dueDate = newDueDate;
	}

	set priority(newPriority) {
		if (!Todo.PRIORITIES.includes(newPriority)) {
			throw new Error(`Priority must be one of: ${Todo.PRIORITIES.join(', ')}`);
		}
		this.#priority = newPriority;
	}
}
