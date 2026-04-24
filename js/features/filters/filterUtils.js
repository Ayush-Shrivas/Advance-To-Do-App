export const filterTasks = (tasks, filters) => {
    return tasks.filter(task => {
        // Search filter
        const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
        
        // Status filter
        let matchesStatus = true;
        if (filters.status === 'pending') matchesStatus = !task.completed;
        if (filters.status === 'completed') matchesStatus = task.completed;

        // Priority filter
        const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

        // Category filter
        const matchesCategory = filters.category === 'all' || task.category === filters.category;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
};
