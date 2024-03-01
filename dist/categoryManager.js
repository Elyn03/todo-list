class CategoryManager {
    allCategories = [];
    // get list of all the categories
    getCategory() {
        let localStorageDatas = localStorage.getItem('@listCategories');
        if (localStorageDatas) {
            this.allCategories = JSON.parse(localStorageDatas);
            return this.allCategories;
        }
    }
    // set categories in localStorage
    updateCategory(item) {
        localStorage.setItem('@listCategories', JSON.stringify(item));
    }
    // create category
    createCategory(category) {
        let localStorageDatas = localStorage.getItem('@listCategories');
        if (localStorageDatas) {
            // if LS not empty, push new category in Category
            this.allCategories = JSON.parse(localStorageDatas);
            this.allCategories.push(category);
            this.updateCategory(this.allCategories);
        }
        else {
            // if LS empty, create category
            this.updateCategory(this.allCategories);
        }
    }
}
// create category
function handleCreationCategory(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let formTask = new CategoryManager();
    // get title of new category created
    const title = data.get('categoryTitle');
    const list = { title };
    formTask.createCategory(list);
    location.reload();
}
// display in html all the categories in a select in the taskForm
function displayCategory() {
    let formCategory = new CategoryManager();
    const listCategory = document.getElementById("taskCategory");
    const listFilterCategory = document.getElementById("filterCategory");
    const listModifyCategory = document.getElementById("modifyTaskPriority");
    let category = formCategory.getCategory();
    category?.forEach((element) => {
        const option = document.createElement('option');
        option.value = element.title;
        option.textContent = element.title;
        listCategory?.appendChild(option);
        listFilterCategory?.appendChild(option);
        listModifyCategory?.appendChild(option);
    });
}
// add new task on categoryForm click
const form = document.getElementById('categoryForm');
form?.addEventListener('submit', (event) => handleCreationCategory(event));
displayCategory();
export {};
