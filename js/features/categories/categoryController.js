import { DOM } from '../../utils/constants.js';

export const updateCategoryFilterOptions = (tasks) => {
    const categories = new Set(tasks.map(t => t.category).filter(Boolean));
    
    // Keep the "All Categories" option
    const currentValue = DOM.categoryFilter.value;
    
    DOM.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        DOM.categoryFilter.appendChild(option);
    });

    // Restore selection if it still exists
    if (categories.has(currentValue)) {
        DOM.categoryFilter.value = currentValue;
    }
};
