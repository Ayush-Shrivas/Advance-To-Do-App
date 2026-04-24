import { STORAGE_KEY, THEME_KEY } from '../utils/constants.js';

export const storageService = {
    getTasks: () => {
        try {
            const tasks = localStorage.getItem(STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (e) {
            console.error('Error reading tasks from local storage', e);
            return [];
        }
    },
    
    saveTasks: (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Error saving tasks to local storage', e);
        }
    },

    getTheme: () => {
        return localStorage.getItem(THEME_KEY) || 'light';
    },

    setTheme: (theme) => {
        localStorage.setItem(THEME_KEY, theme);
    }
};
