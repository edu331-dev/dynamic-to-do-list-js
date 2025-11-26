// Run the script after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Utility: get tasks array from localStorage (returns array)
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    // Utility: save tasks array to localStorage
    function saveTasksToStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a single task DOM element and append to the list
    // Accepts a task object: { id: string|number, text: string }
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.setAttribute('data-id', task.id);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";

        // REQUIRED: use classList.add
        removeBtn.classList.add('remove-btn');

        // Remove task on button click and update storage
        removeBtn.onclick = function () {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove from storage
            const tasks = getStoredTasks();
            const filtered = tasks.filter(t => String(t.id) !== String(task.id));
            saveTasksToStorage(filtered);
        };

        // Append remove button then li to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    // Add a new task
    // If save === true (default), persist to localStorage; if false, only update DOM
    function addTask(taskText, save = true) {
        const trimmed = String(taskText || '').trim();

        // Validate input
        if (trimmed === "") {
            // If this was called as part of loading (save=false) ignore empty silently,
            // otherwise prompt user
            if (save) alert("Please enter a task.");
            return;
        }

        // Build task object with a unique id
        const task = {
            id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
            text: trimmed
        };

        // Create DOM element
        createTaskElement(task);

        // Save to localStorage if requested
        if (save) {
            const tasks = getStoredTasks();
            tasks.push(task);
            saveTasksToStorage(tasks);
        }

        // Clear input field if this was a user action
        if (save) taskInput.value = "";
    }

    // Load tasks from localStorage and render them
    function loadTasks() {
        const stored = getStoredTasks();
        stored.forEach(task => {
            // addTask with save=false to avoid double-saving
            addTask(task.text, false);

            // But we need to ensure the element's data-id matches the stored id.
            // createTaskElement above created a new id—so instead call createTaskElement directly:
            // To avoid duplication we will clear the last appended element and recreate using stored object.
        });

        // The above approach (calling addTask with save=false) appended li elements without correct data-id.
        // To guarantee correct IDs, clear list and recreate properly:
        taskList.innerHTML = '';
        stored.forEach(task => createTaskElement(task));
    }

    // Event listeners

    // Add task on button click
    addButton.addEventListener('click', function () {
        addTask(taskInput.value, true);
    });

    // Add task when pressing Enter key
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask(taskInput.value, true);
        }
    });

    // Initialize: load tasks from localStorage
    loadTasks();

    // (Optional) If you need to expose addTask globally for automated tests, you can:
    // window.addTask = addTask;
});
