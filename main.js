
const searchInput = document.getElementById("searchInput");
const options = document.querySelector(".options");
const repositoryList = document.querySelector(".repositoryList");

let addedRepositories = [];

searchInput.addEventListener('input', debounce(fetchRepositories, 300));

function fetchRepositories() {
    const query = searchInput.value.trim();
    if (query === '') {
        clearAutocomplete();
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            const repositories = data.items;
            displayAutocomplete(repositories);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayAutocomplete(repositories) {
    clearAutocomplete();

    repositories.forEach(repository => {
        const listItem = document.createElement('li');
        listItem.textContent = repository.name;
        listItem.addEventListener('click', () => addRepository(repository));
        options.appendChild(listItem);
    });
}

function clearAutocomplete() {
    options.innerHTML = '';
}

function addRepository(repository) {
    addedRepositories.push(repository);
    renderRepositoryList();
    searchInput.value = '';
    clearAutocomplete();
}


function deleteRepository(event) {
    let target = event.target;
    const repositoryItem = target.closest(".repositoryList li");
    if (target.className === "delete-button")
        repositoryList.removeChild(repositoryItem);
    else {
        return;
    }
}
function renderRepositoryList() {
    repositoryList.innerHTML = '';

    addedRepositories.forEach((repository, index) => {
        const listItem = document.createElement('li');

        const title = document.createElement("div");
        title.textContent = `Name: ${repository.name}`;
        listItem.append(title);

        const owner = document.createElement("div");
        owner.textContent = `Owner: ${repository.owner.login}`;
        listItem.append(owner);

        const stars = document.createElement("div");
        stars.textContent = `Stars: ${repository.stargazers_count}`;
        listItem.append(stars);

        const button = document.createElement("button");
        button.classList.add("delete-button");
        listItem.append(button);
        repositoryList.appendChild(listItem);
        listItem.onclick = deleteRepository;

     /*   button.addEventListener("click", function(){
            deleteRepository(${index});
        })*/
    });
}



function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}