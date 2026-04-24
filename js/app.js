import { taskState } from './state/taskState.js';
import { renderTasks } from './features/tasks/taskRenderer.js';
import { initTaskEvents } from './features/tasks/taskEvents.js';
import { updateCategoryFilterOptions } from './features/categories/categoryController.js';
import { initTheme } from './config/appConfig.js';
import { initInteractiveWaves } from './effects/interactiveWaves.js';

const initApp = () => {
    // Initialize Theme
    initTheme();
    initInteractiveWaves();

    // Initialize Event Listeners
    initTaskEvents();

    // Subscribe UI to State Changes
    taskState.subscribe((tasks, filters) => {
        renderTasks(tasks, filters);
        updateCategoryFilterOptions(tasks);
    });

    // Initial Render
    taskState.notify();
};

document.addEventListener('DOMContentLoaded', initApp);
