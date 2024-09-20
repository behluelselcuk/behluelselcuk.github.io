document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Aufgabe hinzufügen
    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const newTask = document.createElement('li');
            newTask.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-task">Löschen</button>
            `;
            taskList.appendChild(newTask);
            taskInput.value = "";
            addTaskListeners(newTask);
        }
    });

    // Event-Listener für Aufgaben-Interaktionen hinzufügen
    function addTaskListeners(taskItem) {
        const deleteButton = taskItem.querySelector('.delete-task');
        deleteButton.addEventListener('click', function() {
            taskItem.remove();
        });

        taskItem.addEventListener('click', function() {
            taskItem.classList.toggle('completed');
        });
    }
});