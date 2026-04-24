import { DOM } from '../../utils/constants.js';
import { filterTasks } from '../filters/filterUtils.js';
import { escapeHTML } from '../../utils/helpers.js';

export const renderTasks = (tasks, filters) => {
    const filteredTasks = filterTasks(tasks, filters);
    
    DOM.taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        DOM.emptyState.classList.remove('hidden');
    } else {
        DOM.emptyState.classList.add('hidden');
        
        const fragment = document.createDocumentFragment();
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.dataset.priority = task.priority;

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="custom-checkbox btn-toggle" ${task.completed ? 'checked' : ''}>
                    <div class="task-details">
                        <span class="task-title">${escapeHTML(task.title)}</span>
                        <div class="task-meta">
                            <span class="badge ${task.priority}">${task.priority}</span>
                            ${task.category ? `<span class="badge category">${escapeHTML(task.category)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" aria-label="Edit Task">✏️</button>
                    <button class="btn-delete" aria-label="Delete Task">🗑️</button>
                </div>
            `;
            
            fragment.appendChild(li);
        });

        DOM.taskList.appendChild(fragment);
    }
};

export const renderEditMode = (taskElement, currentTitle) => {
    const titleSpan = taskElement.querySelector('.task-title');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = currentTitle;
    
    titleSpan.replaceWith(input);
    input.focus();
    
    // Hide actions while editing
    taskElement.querySelector('.task-actions').classList.add('hidden');
    
    return input;
};
