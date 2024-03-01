class TaskManager {
    allTasks = [];
    // get list of all the tasks
    getTasks(mode, keyword, filter) {
        let localStorageDatas = localStorage.getItem('@listTasks');
        if (localStorageDatas) {
            this.allTasks = JSON.parse(localStorageDatas);
            if (mode === "all") {
                getItem(this.allTasks);
                return this.allTasks;
            }
            else if (mode === "search") {
                let item = this.allTasks.filter(task => task.title.toLowerCase().includes(keyword.toLowerCase()));
                getItem(item);
                return item;
            }
            else if (mode === "filter") {
                let item = this.allTasks;
                // variables, is filtered or not ?
                let isPriorityFiltered = filter?.priority === "all" ? false : true;
                let isCategoryFiltered = filter?.category === "none" ? false : true;
                let isDateFiltered = filter?.date === "" ? false : true;
                // list of all the possibilities of the filter
                if (isPriorityFiltered && !isCategoryFiltered && !isDateFiltered) {
                    item = this.allTasks.filter(task => task.priority === filter.priority);
                }
                else if (!isPriorityFiltered && !isCategoryFiltered && isDateFiltered) {
                    item = this.allTasks.filter(task => task.date === filter.date);
                }
                else if (!isPriorityFiltered && isCategoryFiltered && !isDateFiltered) {
                    item = this.allTasks.filter(task => task.category === filter.category);
                }
                else if (isPriorityFiltered && !isCategoryFiltered && isDateFiltered) {
                    item = this.allTasks.filter(task => task.priority === filter?.priority && task.date === filter?.date);
                }
                else if (isPriorityFiltered && isCategoryFiltered && !isDateFiltered) {
                    item = this.allTasks.filter(task => task.priority === filter?.priority && task.category === filter?.category);
                }
                else if (!isPriorityFiltered && isCategoryFiltered && isDateFiltered) {
                    item = this.allTasks.filter(task => task.date === filter?.date && task.category === filter?.category);
                }
                else if (isPriorityFiltered && isCategoryFiltered && isDateFiltered) {
                    item = this.allTasks.filter(task => task.priority === filter?.priority && task.date === filter?.date && task.category === filter?.category);
                }
                getItem(item);
                return item;
            }
        }
    }
    // set tasks in localStorage
    updateTasks(item) {
        localStorage.setItem('@listTasks', JSON.stringify(item));
    }
    // create task
    createTask(task) {
        let localStorageDatas = localStorage.getItem('@listTasks');
        if (localStorageDatas) {
            // if LS not empty, push new task in Tasks
            this.allTasks = JSON.parse(localStorageDatas);
            this.allTasks.push(task);
            this.updateTasks(this.allTasks);
        }
        else {
            // if LS empty, create tasks
            this.updateTasks(this.allTasks);
        }
    }
    // delete task
    deleteTask(index) {
        let localStorageDatas = localStorage.getItem('@listTasks');
        if (localStorageDatas) {
            this.allTasks = JSON.parse(localStorageDatas);
            if (index !== -1) {
                this.allTasks.splice(index, 1);
                this.updateTasks(this.allTasks);
                location.reload();
            }
        }
    }
    // update task
    updateTask(task, newTask) {
        let localStorageDatas = localStorage.getItem('@listTasks');
        if (localStorageDatas) {
            this.allTasks = JSON.parse(localStorageDatas);
            const index = this.allTasks.findIndex(t => t.title && t.date === task.date);
            if (index !== -1) {
                this.allTasks[index] = newTask;
                this.updateTasks(this.allTasks);
                location.reload();
            }
        }
    }
}
// create or update task
function handleCreateTask(event, mode, index) {
    event.preventDefault();
    const data = new FormData(event.target);
    let formTask = new TaskManager();
    // get data from taskForm
    const title = data.get(mode ? `modifyTaskTitle` : 'taskTitle');
    const description = data.get(mode ? `modifyTaskDescription` : 'taskDescription');
    const date = data.get(mode ? `modifyDate` : 'date');
    const priority = data.get(mode ? `modifyTaskPriority` : 'taskPriority');
    const category = data.get(mode ? `modifyTaskCategory` : 'taskCategory');
    const list = {
        title,
        description,
        date,
        priority,
        category
    };
    if (mode) {
        formTask.updateTask(mode, list);
    }
    else {
        formTask.createTask(list);
    }
    location.reload();
}
// display in html all the tasks
function getItem(item) {
    let formTask = new TaskManager();
    const listTasks = document.getElementById("tasks");
    listTasks.innerHTML = "";
    let listOfAllTasks = item;
    listOfAllTasks?.forEach((element, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('some');
        // inject div task in html
        taskElement.innerHTML = `
          <div class="task ${element.priority}" value="${index}">
              <h3>${element.title}<span> - ${element.priority} ${element.category ? " - " + element.category : ""}</span></h3>
              <p>Date d'échéance: ${element.date}</p>
              <p>${element.description}</p>
              <button type="button" class="delete-btn">Supprimer</button>
              <button class="edit-btn">Modifier</button>
          </div>
          <form id="modifyTaskForm${index}" class="hidden">
              <input type="text" name="modifyTaskTitle" id="modifyTaskTitle" placeholder="Titre de la tâche" required>
              <textarea name="modifyTaskDescription" id="modifyTaskDescription" placeholder="Description de la tâche" required></textarea>
              <input name="modifyDate" type="Date" id="modifyTaskDueDate" required>
              <select name="modifyTaskPriority" id="modifyTaskPriority" required>
                  <option value="low">Faible</option>
                  <option value="medium" selected>Moyenne</option>
                  <option value="high">Haute</option>
              </select>
              <button type="submit">Update tâche</button>
          </form>
       `;
        const deleteButton = taskElement.querySelector('.delete-btn');
        const editButton = taskElement.querySelector('.edit-btn');
        const modifyTaskForm = taskElement.querySelector(`#modifyTaskForm${index}`);
        const modifyTaskTitleInput = modifyTaskForm?.querySelector('input[name="modifyTaskTitle"]');
        const modifyTaskDescriptionInput = modifyTaskForm?.querySelector('textarea[name="modifyTaskDescription"]');
        const modifyDateInput = modifyTaskForm?.querySelector('input[name="modifyDate"]');
        const modifyTaskPrioritySelect = modifyTaskForm?.querySelector('select[name="modifyTaskPriority"]');
        // event to delete task
        deleteButton?.addEventListener('click', () => {
            formTask.deleteTask(index); // Call the deleteTask method with the task to delete
        });
        // event to edit task
        editButton?.addEventListener('click', () => {
            modifyTaskForm?.classList.toggle('hidden');
            if (modifyTaskForm) {
                // Remplir le formulaire avec les données de la tâche correspondante
                modifyTaskTitleInput.value = element.title;
                modifyTaskDescriptionInput.value = element.description || '';
                modifyDateInput.value = element.date;
                modifyTaskPrioritySelect.value = element.priority;
            }
            //formTask.updateTask(element); // Call the deleteTask method with the task to delete
        });
        const title = element.title;
        const description = element.description;
        const date = element.date;
        const priority = element.priority;
        const newList = {
            title,
            description,
            date,
            priority
        };
        modifyTaskForm?.addEventListener('submit', (event) => handleCreateTask(event, newList, index));
        listTasks?.appendChild(taskElement);
    });
}
function searchThing() {
    const mot = document.getElementById("searchInput");
    const recherceche = mot?.value;
    let formTask = new TaskManager();
    formTask.getTasks("search", recherceche);
}
function filterEvent(event) {
    event.preventDefault();
    const filterDate = document.getElementById("filterDate");
    const filterPriority = document.getElementById("filterPriority");
    const filterCategory = document.getElementById("filterCategory");
    let formTask = new TaskManager();
    // get data filter from taskForm
    const priority = filterPriority?.value;
    const date = filterDate?.value;
    const category = filterCategory?.value;
    const list = {
        priority,
        date,
        category
    };
    formTask.getTasks("filter", "", list);
}
// add new task on taskForm click
const form = document.getElementById('taskForm');
form?.addEventListener('submit', (event) => handleCreateTask(event));
// search on searchButton click
const searchTask = document.getElementById("searchButton");
searchTask?.addEventListener('click', searchThing);
// add new task on taskForm click
const apply = document.getElementById('applyFilter');
apply?.addEventListener('click', (event) => filterEvent(event));
// Obtenez une instance de TaskManager
const formTask = new TaskManager();
// Fonction pour afficher toutes les tâches au démarrage de la page
function displayAllTasks() {
    // Obtenez toutes les tâches et appelez getItem avec elles pour les afficher
    const allTasks = formTask.getTasks("all");
    getItem(allTasks);
}
// Appelez displayAllTasks lors du chargement de la page
window.addEventListener('load', displayAllTasks);
export {};
