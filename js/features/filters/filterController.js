import { DOM } from '../../utils/constants.js';

export const updateActiveFilterButton = (status) => {
    DOM.statusFilters.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === status) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};
