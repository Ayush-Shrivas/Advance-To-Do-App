import { taskState } from '../../state/taskState.js';
import { generateId } from '../../utils/helpers.js';
import { renderEditMode } from './taskRenderer.js';

export const handleAddTask = (title, priority, category) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = {
        id: generateId(),
        title: trimmedTitle,
        priority: priority || 'medium',
        category: category.trim() || 'General',
        completed: false,
        createdAt: new Date().toISOString()
    };

    taskState.addTask(newTask);
};

export const handleToggleTask = (id) => {
    const task = taskState.getTasks().find(t => t.id === id);
    if (task) {
        taskState.updateTask(id, { completed: !task.completed });
    }
};

export const handleDeleteTask = (id) => {
    taskState.deleteTask(id);
};

export const handleEditTask = (taskElement, id) => {
    const task = taskState.getTasks().find(t => t.id === id);
    if (!task) return;

    const input = renderEditMode(taskElement, task.title);

    const saveEdit = () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== task.title) {
            taskState.updateTask(id, { title: newTitle });
        } else {
            // If empty or unchanged, just re-render to revert
            taskState.notify();
        }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
};
