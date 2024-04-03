let taskData = JSON.parse(localStorage.getItem("taskData")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; //if its full, return it, if its empty, make it 1 so the console doesn't render null

// Create a function to generate a unique task id
function generateTaskId() {
    const uniqueId = nextId.toString(); //convert to string
    nextId++;//adding by 1 after each page refresh
    localStorage.setItem("nextId", JSON.stringify(nextId)); //setting it into local storage
    return uniqueId; //this is the unique id for each div
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card draggable overlap')
    const title = $('<p>').text(task.taskTitle);//creating html elements
    const date = $('<p>').text(task.taskDate);
    const desc = $('<p>').text(task.taskDesc);
    const btn = $('<button>').text('Delete').attr('data-btn', 'delete'); //creating and styling btn
    taskCard.append(title, date, desc, btn);
    $("#todo-cards").append(taskCard);

    taskCard.draggable();
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards").empty(); //this is to avoid duplicate 
    taskData.forEach(function (task) {
        createTaskCard(task)
    })
}

// Todo: create a function to handle adding a new task
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
        statusClass = ''; // Default status class
    }
    //pushing new task into task arr
    const newTask = {
        id: generateTaskId(),
        taskTitle: $('#task-title').val(),
        taskDate: $('#task-date').val(),
        taskDesc: taskDesc,
        status: statusClass
    };

    taskData.push(newTask);
    //setting local storage for task data
    localStorage.setItem('taskData', JSON.stringify(taskData));

    createTaskCard(newTask); // Render only the newly added task card
    //clears input values after submission
    $('#task-title').val('');
    $('#task-date').val('');
    $('#task-desc').val('');
}


function handleDeleteTask(event) {
    const deletedTaskId = $(this).closest('.task-card').attr('id');

    taskData = taskData.filter(task => task.id !== deletedTaskId);

    localStorage.setItem('taskData', JSON.stringify(taskData));

    $(this).closest('.task-card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('form').on('submit', function (event) {
        handleAddTask(event);
    });

    $('body').on('click', '.task-card button', handleDeleteTask);

});
