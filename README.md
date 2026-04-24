# Advanced To-Do App

A polished, modular to-do application built with vanilla HTML, CSS, and JavaScript. It combines practical task management features with a more premium visual layer, including theme switching, responsive layouts, local persistence, and an interactive animated waves background.

## Overview

This project is designed as a lightweight front-end app with no framework dependency. Tasks are created, edited, filtered, completed, and deleted directly in the browser, while application state and theme preferences are persisted in `localStorage`.

The codebase is organized by responsibility so the UI, state management, filters, storage, and visual effects stay easy to maintain and extend.

## Features

- Add, edit, complete, and delete tasks
- Assign task priority levels: `low`, `medium`, and `high`
- Organize tasks by category
- Search tasks by title
- Filter by status, priority, and category
- Persist tasks in browser `localStorage`
- Toggle between light and dark themes
- Responsive layout for desktop and mobile screens
- Interactive animated waves background for a richer visual experience

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Browser `localStorage` for persistence
- Canvas API for the animated background effect

## Project Structure

```text
advanced-todo-html/
|-- assets/
|   |-- icons/
|   `-- images/
|-- css/
|   |-- base.css
|   |-- components.css
|   |-- layout.css
|   |-- responsive.css
|   `-- themes.css
|-- js/
|   |-- app.js
|   |-- config/
|   |   `-- appConfig.js
|   |-- effects/
|   |   `-- interactiveWaves.js
|   |-- features/
|   |   |-- categories/
|   |   |   `-- categoryController.js
|   |   |-- filters/
|   |   |   |-- filterController.js
|   |   |   `-- filterUtils.js
|   |   `-- tasks/
|   |       |-- taskController.js
|   |       |-- taskEvents.js
|   |       `-- taskRenderer.js
|   |-- services/
|   |   `-- storageService.js
|   |-- state/
|   |   `-- taskState.js
|   `-- utils/
|       |-- constants.js
|       |-- debounce.js
|       `-- helpers.js
|-- screenshots/
|   |-- Dark Mode.png
|   |-- Light Mode.png
|   |-- Screenshot 2026-04-24 123232.png
|   |-- Screenshot 2026-04-24 123244.png
|   `-- Screenshot 2026-04-24 123257.png
|-- index.html
`-- README.md
```

## Architecture Notes

### `index.html`

The main application shell. It defines the layout for the header, hero section, task input form, filters, and task list.

### `css/`

The styling is split into focused files:

- `themes.css`: design tokens and light/dark theme variables
- `base.css`: global resets and foundational styles
- `layout.css`: page structure, hero layout, and backdrop styling
- `components.css`: reusable UI elements such as buttons, forms, task cards, and waves canvas helpers
- `responsive.css`: mobile-specific layout adjustments

### `js/app.js`

The application entry point. It initializes the theme, animated waves effect, task events, and the state-driven UI render cycle.

### `js/state/taskState.js`

Manages the in-memory task list, active filters, state updates, and subscriptions for re-rendering.

### `js/services/storageService.js`

Handles reading and writing task data and theme preferences from browser `localStorage`.

### `js/features/`

Feature-based modules keep behavior grouped by domain:

- `tasks/`: add, edit, toggle, delete, and render tasks
- `filters/`: filtering utilities and active filter state behavior
- `categories/`: category filter option generation based on task data

### `js/effects/interactiveWaves.js`

Contains the interactive canvas-based waves effect adapted for this project. It responds to pointer movement and serves as a decorative background layer.

## How to Run

Because this is a vanilla front-end project, you can run it without a build step.

### Option 1: Open directly

Open [index.html](./index.html) in your browser.

### Option 2: Use a local server

Using a simple local server is recommended for a smoother development workflow.

Examples:

```bash
# VS Code Live Server
Open the project folder and start Live Server
```

```bash
# Python
python -m http.server
```

Then open `http://localhost:8000`.

## Core User Flow

1. Enter a task title
2. Choose a priority
3. Optionally assign a category
4. Add the task
5. Use search and filters to narrow the list
6. Mark tasks as completed or edit/delete them as needed

## Data Persistence

The app stores:

- Tasks in `localStorage` under the key defined by `STORAGE_KEY`
- Theme preference in `localStorage` under the key defined by `THEME_KEY`

This means task data remains available across page refreshes in the same browser.

## Screenshots

Reference images are available in the [`screenshots`](./screenshots) folder, including:

- `Light Mode.png`
- `Dark Mode.png`

## Future Improvement Ideas

- Due dates and reminders
- Drag-and-drop task sorting
- Task completion statistics
- Bulk task actions
- Better icon handling for edit and delete buttons
- Optional backend sync for multi-device support

## License

This project is available for personal and educational use. Add a formal license if you plan to distribute it publicly.
