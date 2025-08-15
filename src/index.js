import './styles.css';

import { TaskManager } from './taskManager.js';
import { Dom } from './dom.js';

const manager = new TaskManager();
const dom = new Dom(manager);
