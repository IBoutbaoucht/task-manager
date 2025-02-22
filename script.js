document.addEventListener('DOMContentLoaded', () => {
    let count = 1;
    let tasks = []; 
    const timeNow = document.getElementById('timeNow');
    const TasksForm = document.getElementById('Tasks-Form');
    TasksForm.style.display = 'none';
    const addingAtask = document.getElementById('addingAtask');
    addingAtask.style.display = 'none';
    const showbutton = document.getElementById('showbutton');
    const addAtask = document.getElementById('addAtask');
    const addingH = document.getElementById('addingHeure');
    const addingM = document.getElementById('addingMinute');
    const addingT = document.getElementById('addingText');
    const addingC = document.getElementById('addingCheck');
    const submitTask = document.getElementById('submitTask');
    const showhide = document.getElementById('show-hide');

    let NoTasks = document.createElement('p');
    NoTasks.textContent = 'No Tasks Yet!';

    TasksForm.addEventListener('submit', (e) => e.preventDefault());

    [addingH, addingM, addingT].forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") e.preventDefault();
        });
    });

    // Utility function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Utility function to load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            if (tasks.length > 0) {
                count = Math.max(...tasks.map(task => task.id)) + 1;
            }
        }
    }

    // Load tasks on page load
    loadTasks();
    renderTasks();

    function updateTime() {
        let now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');

        if (seconds === "00") {
            taskAlert();
        }

        timeNow.textContent = `Time currently: ${hours}:${minutes}:${seconds}.`;
    }

    setInterval(updateTime, 1000);

    // Ensure "Show Tasks" state is persistent
    let previousState = JSON.parse(localStorage.getItem("showTasks")) || false;
    showbutton.checked = previousState;
    TasksForm.style.display = previousState ? 'block' : 'none';
    showhide.textContent = previousState ? 'Hide Tasks.' : 'Show Tasks.';

    showbutton.addEventListener('change', function () {
        let isChecked = this.checked;
        showhide.textContent = isChecked ? 'Hide Tasks.' : 'Show Tasks.';
        TasksForm.style.display = isChecked ? 'block' : 'none';
        localStorage.setItem("showTasks", JSON.stringify(isChecked));
    });

    addAtask.addEventListener('click', () => {
        let now = new Date();
        addingH.value = now.getHours().toString().padStart(2, '0');
        addingM.value = now.getMinutes().toString().padStart(2, '0');
        addingT.value = '' ;
        addingC.checked = true ;
        addingAtask.style.display = 'block';
    });

    submitTask.addEventListener('click', () => {
        if (!addingH.value || !addingM.value || !addingT.value) {
            alert("You need to fill in all fields!");
        } else {
            let task = {
                id: count++,
                hour: parseInt(addingH.value),
                minute: parseInt(addingM.value),
                text: addingT.value,
                checked: addingC.checked
            };

            tasks.push(task);
            tasks.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
            renderTasks();
            saveTasks();
            addingAtask.style.display = 'none';
        }
    });

    function renderTasks() {
        TasksForm.innerHTML = "";

        if (tasks.length === 0) {
            if (!TasksForm.contains(NoTasks)) {
                TasksForm.appendChild(NoTasks);
            }
            return;
        }

        tasks.forEach(task => {
            TasksForm.innerHTML += `
                <li id="timeEntry-${task.id}">
                    <input type="checkbox" class="checked-boxs" data-id="${task.id}" ${task.checked ? 'checked' : ''}>
                    <input type="number" min="0" max="23" value="${task.hour.toString().padStart(2, '0')}" id="hour-${task.id}">
                    <input type="number" min="0" max="59" value="${task.minute.toString().padStart(2, '0')}" id="minute-${task.id}">
                    <input type="text" value="${task.text}" id="text-${task.id}">
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </li>
            `;
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                let taskId = parseInt(this.getAttribute("data-id"));
                deleteTask(taskId);
            });
        });

        document.querySelectorAll(".checked-boxs").forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                let taskId = parseInt(this.getAttribute("data-id"));
                let task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.checked = this.checked;
                    saveTasks();
                }
            });
        });

        ["hour", "minute", "text"].forEach(type => {
            document.querySelectorAll(`input[id^="${type}-"]`).forEach(input => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") e.preventDefault();
                });
                input.addEventListener("change", function () {
                    let taskId = parseInt(this.id.split("-")[1]);
                    let task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task[type] = type === "text" ? this.value : parseInt(this.value);
                        tasks.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
                        renderTasks();
                        saveTasks();
                    }
                });
            });
        });
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        saveTasks();
    }

    function taskAlert() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();

        tasks = tasks.filter(task => {
            if (task.hour === hours && task.minute === minutes && task.checked) {
                alert(task.text);
                return false;
            }
            return true;
        });

        renderTasks();
        saveTasks();
    }

    setInterval(taskAlert, 60000);
});
