document.addEventListener('DOMContentLoaded', () => {
    let count = 1;
    let tasks = []; // Array to store tasks

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
    NoTasks.textContent = 'No Tasks Yet!' ;

    // Prevent default form submission for TasksForm
    TasksForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    // Prevent Enter key in the addingAtask inputs
    [addingH, addingM, addingT].forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
    });

    function updateTime() {
        let now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        
        // Call taskAlert when seconds is "00"
        if (seconds === "00") {
            taskAlert();
        }
        
        timeNow.textContent = `Time currently : ${hours}:${minutes}:${seconds}.`;
    }

    setInterval(updateTime, 1000);

    showbutton.addEventListener('change', function () {
        if (this.checked){
            showhide.textContent = 'Hide Tasks.';
            TasksForm.style.display = 'block';
        } else {
            showhide.textContent = 'Show Tasks.';
            TasksForm.style.display = 'none';
        }
    });

    addAtask.addEventListener('click', () => {
        let now = new Date();
        addingC.checked = true ; 
        addingH.value = now.getHours().toString().padStart(2, '0');
        addingM.value = now.getMinutes().toString().padStart(2, '0');
        addingT.value = '' ;
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
                checked: addingC.checked // use boolean value
            };
            
            tasks.push(task);
            tasks.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
            renderTasks();
            addingAtask.style.display = 'none';
        }
    });

    function renderTasks() {
        TasksForm.innerHTML = "";
        if (tasks.length == 0){
            TasksForm.appendChild(NoTasks);
            return;
        }
        tasks.forEach(task => {
            TasksForm.innerHTML += `
                <li id="timeEntry-${task.id}">
                    <input type="checkbox" class="checked-boxs" data-id="${task.id}" ${task.checked ? 'checked' : ''}>
                    <input type="number" min="0" max="23" value="${task.hour}" id="hour-${task.id}">
                    <input type="number" min="0" max="59" value="${task.minute}" id="minute-${task.id}">
                    <input type="text" value="${task.text}" id="text-${task.id}">
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </li>
            `;
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                let taskId = parseInt(this.getAttribute("data-id"));
                deleteTask(taskId);
            });
        });

        // Attach event listeners for checkboxes
        document.querySelectorAll(".checked-boxs").forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                let taskId = parseInt(this.getAttribute("data-id"));
                let task = tasks.find(t => t.id === taskId);
                if (task) task.checked = this.checked;
            });
        });

        // Prevent Enter key for hour, minute, and text inputs while updating values
        document.querySelectorAll('input[id^="hour-"]').forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            });
            input.addEventListener("change", function () {
                let taskId = parseInt(this.id.split("-")[1]);
                let task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.hour = parseInt(this.value);
                    tasks.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
                    renderTasks();
                }
            });
        });

        document.querySelectorAll('input[id^="minute-"]').forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            });
            input.addEventListener("change", function () {
                let taskId = parseInt(this.id.split("-")[1]);
                let task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.minute = parseInt(this.value);
                    tasks.sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
                    renderTasks();
                }
            });
        });

        document.querySelectorAll('input[id^="text-"]').forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            });
            input.addEventListener("change", function () {
                let taskId = parseInt(this.id.split("-")[1]);
                let task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.text = this.value;
                }
            });
        });
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }

    function taskAlert() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        tasks = tasks.filter(task => {
            if (task.hour === hours && task.minute === minutes && task.checked) {
                alert(task.text);
                return false; // Remove this task from the list
            }
            return true;
        });
        renderTasks();
    }
});
