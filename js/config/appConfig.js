import { storageService } from '../services/storageService.js';
import { DOM } from '../utils/constants.js';

export const initTheme = () => {
    const currentTheme = storageService.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    DOM.themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        storageService.setTheme(newTheme);
    });
};
