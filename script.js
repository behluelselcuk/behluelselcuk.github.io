// Warten, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Funktion zum Hinzufügen einer neuen Aufgabe
    const addTask = () => {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Bitte geben Sie eine Aufgabe ein.');
            return;
        }

        // Erstellen eines neuen Listenelements
        const li = document.createElement('li');

        // Erstellen des Aufgabentexts
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        // Erstellen des Aktionsbereichs
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        // Erledigt-Button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Erledigt';
        completeBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        // Löschen-Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
        });

        // Zusammenfügen der Elemente
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(taskSpan);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);

        // Zurücksetzen des Eingabefelds
        taskInput.value = '';
    };

    // Event Listener für den Hinzufügen-Button
    addTaskBtn.addEventListener('click', addTask);

    // Hinzufügen der Aufgabe bei Drücken der Enter-Taste
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});