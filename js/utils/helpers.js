export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
};
