// Retrieve tasks and nextId from localStorage
let taskData = JSON.parse(localStorage.getItem("taskData")) || []; //return what is in local storage, if it is empty, return empty array to avoid console returning null
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; //if its full, return it, if its empty, make it 1 so the console doesn't render null

//converts nextId to string, increases by one each refresh, stores it in local storage
function generateTaskId() {
    const uniqueId = nextId.toString();
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return uniqueId;
}

// creates card, adds classes, id, to make it draggable and correct styles appear
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card draggable overlap ' + task.progress).attr('id', task.id);//create div, add class, add uuid
    const title = $('<p>').text(task.taskTitle);//creating html elements
    const date = $('<p>').text(task.taskDate);
    const desc = $('<p>').text(task.taskDesc);
    const btn = $('<button>').text('Delete').attr('data-btn', 'delete'); //creating and styling btn
    taskCard.append(title, date, desc, btn);
    $("#todo-cards").append(taskCard);

    taskCard.draggable();
}
// renders each task by calling createTaskCard function and checking if the todo-card div is empty to avoid duplicates
function renderTaskList() {
    $("#todo-cards").empty();

    taskData.forEach(function (task) {
        createTaskCard(task)
    })

}


//prevents users from submitting empty inputs, adds background color classes dynamically, pushes data into local storage
function handleAddTask(event) {
    event.preventDefault();


    if ($('#task-title').val() === "" || $('#task-date').val() === "" || $('#task-desc').val() === "") {
        alert("Please fill in all input fields");
        return;
    }

    let progressClass;
    const taskDesc = $('#task-desc').val().toLowerCase();
    if (taskDesc === 'past due') {
        progressClass = 'past-due';
    } else if (taskDesc === 'in progress') {
        progressClass = 'in-progress';
    } else if (taskDesc === 'done') {
        progressClass = 'done';
    } else {
        progressClass = '';
    }

    const newTask = {
        id: generateTaskId(),
        taskTitle: $('#task-title').val(),
        taskDate: $('#task-date').val(),
        taskDesc: taskDesc,
        progress: progressClass
    };

    taskData.push(newTask);

    localStorage.setItem('taskData', JSON.stringify(taskData));

    createTaskCard(newTask);

    $('#task-title').val('');
    $('#task-date').val('');
    $('#task-desc').val('');
}

//Finds the task card with the parent element of task-card, filters taskData to render only cards that aren't deleted, updates local storage
function handleDeleteTask(event) {
    const deleteTaskCard = $(event.target).parent('.task-card').attr('id');

    taskData = taskData.filter(function (task) {
        return task.id !== deleteTaskCard
    })

    localStorage.setItem('taskData', JSON.stringify(taskData));

    $(event.target).parent('.task-card').remove();
}



$(document).ready(function () {
    renderTaskList();

    $('form').on('submit', function (event) {
        handleAddTask(event);
    });

    $('body').on('click', '.task-card button', handleDeleteTask);

});
