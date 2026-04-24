import { storageService } from '../services/storageService.js';

class TaskState {
    constructor() {
        this.tasks = storageService.getTasks();
        this.listeners = [];
        this.filters = {
            search: '',
            status: 'all',
            priority: 'all',
            category: 'all'
        };
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.tasks, this.filters));
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(newTasks) {
        this.tasks = newTasks;
        storageService.saveTasks(this.tasks);
        this.notify();
    }

    addTask(task) {
        this.setTasks([...this.tasks, task]);
    }

    updateTask(id, updates) {
        const updatedTasks = this.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
        );
        this.setTasks(updatedTasks);
    }

    deleteTask(id) {
        const filteredTasks = this.tasks.filter(task => task.id !== id);
        this.setTasks(filteredTasks);
    }

    setFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.notify(); // Re-render when filters change
    }
}

export const taskState = new TaskState();
