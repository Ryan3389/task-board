// Retrieve tasks and nextId from localStorage
let taskData = JSON.parse(localStorage.getItem("taskData")) || [];
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
    const taskCard = $('<div>').addClass('task-card draggable overlap ' + task.status).attr('id', task.id);//create div, add class, add uuid
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

    taskData.forEach(task => {
        createTaskCard(task);
    });
}


//prevents users from submitting empty inputs, adds background color classes dynamically, pushes data into local storage
function handleAddTask(event) {
    event.preventDefault();

    //avoid any empty inputs
    if ($('#task-title').val() === "" || $('#task-date').val() === "" || $('#task-desc').val() === "") {
        alert("Please fill in all input fields");
        return;
    }
    //dynamically adding classes based on due date
    let statusClass;
    const taskDesc = $('#task-desc').val().toLowerCase();
    if (taskDesc === 'past due') {
        statusClass = 'past-due';
    } else if (taskDesc === 'in progress') {
        statusClass = 'in-progress';
    } else if (taskDesc === 'done') {
        statusClass = 'done';
    } else {
        statusClass = '';
    }

    const newTask = {
        id: generateTaskId(),
        taskTitle: $('#task-title').val(),
        taskDate: $('#task-date').val(),
        taskDesc: taskDesc,
        status: statusClass
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
    // Find the task card that is being deleted
    //const deletedTaskId = $(this).closest('.task-card').attr('id');
    const deletedTaskId = $(event.target).parent('.task-card').attr('id');


    // Remove the deleted task from taskData array
    //taskData = taskData.filter(task => task.id !== deletedTaskId);
    taskData = taskData.filter(function (task) {
        return task.id !== deletedTaskId
    })


    // Update the local storage with the modified taskData
    localStorage.setItem('taskData', JSON.stringify(taskData));

    // Remove the task card from the UI
    $(event.target).parent('.task-card').remove();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}


$(document).ready(function () {
    renderTaskList();

    $('form').on('submit', function (event) {
        handleAddTask(event);
    });

    $('body').on('click', '.task-card button', handleDeleteTask);

    // Make lanes droppable
    $('.droppable').droppable({
        accept: '.task-card',
        drop: handleDrop
    });
});
