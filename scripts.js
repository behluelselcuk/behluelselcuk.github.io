const tasks = {
    morning: [
        "Yoga oder Meditation",
        "Gesundes Frühstück",
        "Englisch lernen"
    ],
    lateMorning: [
        "Webentwicklung (JavaScript)",
        "Pause",
        "Webentwicklung (JavaScript)"
    ],
    noon: [
        "Mittagessen und Pause"
    ],
    afternoon: [
        "Englisch lernen",
        "Webentwicklung (JavaScript)",
        "Pause",
        "Baglama üben"
    ],
    evening: [
        "Sport und Bewegung",
        "Abendessen",
        "Englisch lernen",
        "Baglama-Kurs besuchen"
    ]
};

const storageKey = "dailyTasks";
const dailyProgressKey = "dailyProgress";
const weeklyProgressKey = "weeklyProgress";
const monthlyProgressKey = "monthlyProgress";
let chart, weeklyChart, monthlyChart;

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
    const sections = ["morning", "lateMorning", "noon", "afternoon", "evening"];
    sections.forEach(section => {
        const container = document.querySelector(`#${section} .task-list`);
        container.innerHTML = "";  // Clear previous content
        tasks[section].forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task card";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = savedTasks[section] ? savedTasks[section][index] : false;
            checkbox.addEventListener("change", () => {
                saveTasks(section, index, checkbox.checked);
                updateProgress();
            });
            const label = document.createElement("label");
            label.textContent = task;
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            container.appendChild(taskDiv);
        });
    });
    updateProgress();
}

function saveTasks(section, index, checked) {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
    if (!savedTasks[section]) {
        savedTasks[section] = [];
    }
    savedTasks[section][index] = checked;
    localStorage.setItem(storageKey, JSON.stringify(savedTasks));
    updateProgress();
}

function updateProgress() {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
    const totalTasks = Object.values(tasks).flat().length;
    const completedTasks = Object.values(savedTasks).flat().filter(Boolean).length;
    const progressText = `Erledigt ${completedTasks} von ${totalTasks} Aufgaben (${Math.round((completedTasks / totalTasks) * 100)}%)`;
    document.getElementById("progress").textContent = progressText;
    filterTasks();
    updateDailyProgress(completedTasks, totalTasks);
    updateChart(completedTasks, totalTasks);
    updateWeeklyChart();
    updateMonthlyChart();
}

function updateDailyProgress(completedTasks, totalTasks) {
    const today = new Date().toISOString().split('T')[0];
    const dailyProgress = JSON.parse(localStorage.getItem(dailyProgressKey)) || {};
    dailyProgress[today] = { completedTasks, totalTasks };
    localStorage.setItem(dailyProgressKey, JSON.stringify(dailyProgress));
}

function updateChart(completedTasks, totalTasks) {
    const ctx = document.getElementById("chart").getContext("2d");

    const data = {
        labels: ["Erledigt", "Verbleibend"],
        datasets: [{
            label: 'Aufgaben',
            data: [completedTasks, totalTasks - completedTasks],
            backgroundColor: ['#4caf50', '#f44336']
        }]
    };

    if (chart) {
        chart.data = data;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true
            }
        });
    }
}

function updateWeeklyChart() {
    const dailyProgress = JSON.parse(localStorage.getItem(dailyProgressKey)) || {};
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const labels = [];
    const data = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.unshift(dateString);
        data.unshift(dailyProgress[dateString] ? (dailyProgress[dateString].completedTasks / dailyProgress[dateString].totalTasks) * 100 : 0);
    }

    const ctx = document.getElementById("weekly-chart").getContext("2d");
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Täglicher Fortschritt (%)',
            data: data,
            backgroundColor: '#4caf50'
        }]
    };

    if (weeklyChart) {
        weeklyChart.data = chartData;
        weeklyChart.update();
    } else {
        weeklyChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function updateMonthlyChart() {
    const dailyProgress = JSON.parse(localStorage.getItem(dailyProgressKey)) || {};
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const labels = [];
    const data = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.unshift(dateString);
        data.unshift(dailyProgress[dateString] ? (dailyProgress[dateString].completedTasks / dailyProgress[dateString].totalTasks) * 100 : 0);
    }

    const ctx = document.getElementById("monthly-chart").getContext("2d");
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Täglicher Fortschritt (%)',
            data: data,
            backgroundColor: '#1DD3B0'
        }]
    };

    if (monthlyChart) {
        monthlyChart.data = chartData;
        monthlyChart.update();
    } else {
        monthlyChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function filterTasks() {
    const filter = document.getElementById("filter").value;
    const savedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
    const sections = ["morning", "lateMorning", "noon", "afternoon", "evening"];
    sections.forEach(section => {
        const container = document.querySelector(`#${section} .task-list`);
        const taskDivs = container.getElementsByClassName("task");
        tasks[section].forEach((task, index) => {
            const isChecked = savedTasks[section] ? savedTasks[section][index] : false;
            const taskDiv = taskDivs[index];
            if (isChecked) {
                taskDiv.classList.add("completed");
            } else {
                taskDiv.classList.remove("completed");
            }
            if (filter === "all") {
                taskDiv.style.display = "flex";
            } else if (filter === "completed" && isChecked) {
                taskDiv.style.display = "flex";
            } else if (filter === "pending" && !isChecked) {
                taskDiv.style.display = "flex";
            } else {
                taskDiv.style.display = "none";
            }
        });
    });
}

loadTasks();
