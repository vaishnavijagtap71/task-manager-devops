const API_URL = "http://localhost:5000/tasks";

// Load tasks on page load
window.onload = function () {
    fetchTasks();
};

// Fetch all tasks
function fetchTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";

            data.forEach(task => {
                const li = document.createElement("li");

                li.innerHTML = `
                    ${task.title}
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;

                list.appendChild(li);
            });
        });
}

// Add task
function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value;

    if (!title) return alert("Enter task");

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    })
    .then(() => {
        input.value = "";
        fetchTasks();
    });
}

// Delete task
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => fetchTasks());
}