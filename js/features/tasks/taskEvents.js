import { DOM } from '../../utils/constants.js';
import { handleAddTask, handleToggleTask, handleDeleteTask, handleEditTask } from './taskController.js';
import { taskState } from '../../state/taskState.js';
import { debounce } from '../../utils/debounce.js';
import { updateActiveFilterButton } from '../filters/filterController.js';

export const initTaskEvents = () => {
    // Add Task
    DOM.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddTask(
            DOM.taskTitle.value,
            DOM.taskPriority.value,
            DOM.taskCategory.value
        );
        DOM.taskTitle.value = '';
        DOM.taskCategory.value = '';
    });

    // Task List Delegation (Toggle, Edit, Delete)
    DOM.taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const id = taskItem.dataset.id;

        if (e.target.classList.contains('btn-toggle')) {
            handleToggleTask(id);
        } else if (e.target.closest('.btn-delete')) {
            handleDeleteTask(id);
        } else if (e.target.closest('.btn-edit')) {
            handleEditTask(taskItem, id);
        }
    });

    // Search
    const handleSearch = debounce((e) => {
        taskState.setFilters({ search: e.target.value });
    }, 300);
    DOM.taskSearch.addEventListener('input', handleSearch);

    // Status Filters
    DOM.statusFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const status = e.target.dataset.filter;
            taskState.setFilters({ status });
            updateActiveFilterButton(status);
        }
    });

    // Priority Filter
    DOM.priorityFilter.addEventListener('change', (e) => {
        taskState.setFilters({ priority: e.target.value });
    });

    // Category Filter
    DOM.categoryFilter.addEventListener('change', (e) => {
        taskState.setFilters({ category: e.target.value });
    });
};
