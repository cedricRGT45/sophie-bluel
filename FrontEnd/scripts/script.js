const urlCategories = 'http://localhost:5678/api/categories';
const urlWorks = 'http://localhost:5678/api/works';
const urlLogin = 'http://localhost:5678/api/users/login';
let selectedCategoryId = 0; // by default, display all works

/**
 * Delete works from the index.html gallery
 */
function deleteWorks() {
    // Get the gallery element from index.html
    const gallery = document.getElementsByClassName("gallery").item(0);
    // Remove children of the gallery element
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    };
};

/**
 * Display works in the index.html gallery using API data
 */
function displayWorks() {
    // Fetch API data
    fetch(urlWorks)
        .then(function (response) {
            if (response.ok) {
                deleteWorks();
                return response.json();
            }
        })
        .then(function (data) {
            for (let work of data) {
                if (selectedCategoryId === 0 || selectedCategoryId === work.categoryId) {
                    // Get the gallery element in the DOM
                    const gallery = document.getElementsByClassName("gallery").item(0);
                    // Create cards for each work from the API
                    const figure = document.createElement('figure');
                    const image = document.createElement('img');
                    image.setAttribute("crossorigin", "anonymous");
                    image.setAttribute("src", work.imageUrl);
                    image.alt = work.title;
                    const figCaption = document.createElement('figcaption');
                    figCaption.innerText = work.title;
                    // Attach created elements to the DOM
                    gallery.appendChild(figure);
                    figure.append(image, figCaption);
                };
            };
        })
};

/**
 * Display category filter buttons using API data
 */
function displayFilters() {
    // New promise: wait for this function to be executed in full before executing the next one
    return new Promise(resolve => {
        // Fetch API data
        fetch(urlCategories)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                };
            })
            .then(function (data) {
                // Add the "All" category to the API data
                data.unshift({
                    id: 0,
                    name: 'All'
                });
                // Get DOM elements for attaching filter buttons
                const portfolio = document.getElementById('portfolio');
                const gallery = document.getElementsByClassName('gallery').item(0);
                // Create the filter buttons container
                const divFilters = document.createElement('div');
                divFilters.setAttribute('id', 'container-filters');
                // Create filter buttons based on API data
                for (let category of data) {
                    const button = document.createElement('button');
                    button.classList.add('button-filter');
                    button.innerText = category.name;
                    button.value = category.id;
                    // Attach filter buttons to the DOM
                    divFilters.appendChild(button);
                }
                // Attach the filter buttons container to the DOM
                portfolio.insertBefore(divFilters, gallery);
                // Resolve the promise
                resolve();
            })
    });
};

/**
 * Filter works based on their category
 */
function filterWorks() {
    // Update the selected category identifier
    selectedCategoryId = parseInt(event.target.value);
    // Display filtered works
    displayWorks();
};

/**
 * Display admin mode if the token has been correctly stored during login
 */
function displayAdminMode() {
    if (localStorage.getItem('token')) {
        // Display the logout button
        const log = document.querySelector('nav > ul > li > a');
        log.setAttribute('id', 'logout');
       document.querySelector("#logout").textContent = "Log out"
        // Display the black banner
        const adminHeader = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode éditionS</p></div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "6rem";
        header.insertAdjacentHTML("beforebegin", adminHeader);
        // Create the edit button
        const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
        // Positioning of the edit buttons
        const introSophie = document.querySelector('#introduction h2');
        const galleryTitle = document.querySelector("#portfolio h2");
        galleryTitle.insertAdjacentHTML('afterend', editButtonTemplate);
        // Add "href="#modal"" to the edit button of the gallery
        const editButtonGallery = document.querySelector("#portfolio a");
        editButtonGallery.href = '#modal';
        editButtonGallery.classList.add('open-modal');
        // Disable the filtering function
        const divFilters = document.getElementById('container-filters');
        divFilters.style.display = 'none';
    };
};

/**
 * Open the modal
 */
function openModal() {
    const modal = document.querySelector('#modal');
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    displayModalDeleteWorks();
    displayWorksModal();
};

/**
 * Close the modal
 */
function closeModal() {
    const modal = document.querySelector('#modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    const modalWrapper = document.querySelector('.modal-wrapper');
    while (modalWrapper.firstChild) {
        modalWrapper.removeChild(modalWrapper.firstChild);
    };
};

/**
 * Display the modal in works deletion mode
 */
function displayModalDeleteWorks() {
    // Get the works deletion modal
    const modalWrapper = document.querySelector('.modal-wrapper-delete');
    // Create the navigation element between the two modals
    const modalNav = document.createElement('div');
    modalNav.classList.add('modal-nav');
    // Create the modal close button
    const closeModalButton = document.createElement('i');
    closeModalButton.classList.add('fa-solid', 'fa-xmark', 'close-modal-button');
    // Create the modal title
    const titleModal = document.createElement('h3');
    titleModal.innerText = 'Photo gallery';
    // Create the gallery container
    const containerGallery = document.createElement('div');
    containerGallery.setAttribute('id', 'modal-gallery');
    // Create the "Add photo" button to switch to the works addition modal
    const addWorkButton = document.createElement('button');
    addWorkButton.classList.add('link-modal-add');
    addWorkButton.innerText = 'Add a photo';
    // Create the "Delete gallery" button
    const linkDelete = document.createElement('a');
    linkDelete.href = '#';
    linkDelete.classList.add('js-delete-works');
    linkDelete.innerText = 'Delete the gallery';
    // Attach all the above elements to the DOM
    modalNav.append(closeModalButton);
    modalWrapper.append(modalNav, titleModal, containerGallery, addWorkButton, linkDelete);
};

/**
 * Display works in the modal based on API data
 */
function displayWorksModal() {
    // Fetch API data
    fetch(urlWorks)
        .then(function (response) {
            if (response.ok) {
                // Remove the gallery before adding works from the API
                const gallery = document.getElementById('modal-gallery');
                while (gallery.firstChild) {
                    gallery.removeChild(gallery.firstChild)
                };
                return response.json();
            };
        })
        .then(function (data) {
            for (let work of data) {
                // Get the gallery element in the modal
                const gallery = document.getElementById('modal-gallery');
                // Create cards for each work
                let figure = document.createElement('figure');
                figure.classList.add('modal-figure-works');
                let image = document.createElement('img');
                image.setAttribute('crossorigin', 'anonymous');
                image.setAttribute('src', work.imageUrl);
                image.alt = work.title;
                // Create the "trash can" button for each work
                let deleteButton = document.createElement('i');
                deleteButton.setAttribute('id', work.id);
                deleteButton.classList.add('fa-solid', 'fa-trash-can', 'delete-work');
                // Create the "edit" text under each work
                let figCaption = document.createElement('figcaption');
                figCaption.innerText = 'edit';
                // Attach elements to the DOM
                gallery.append(figure);
                figure.append(deleteButton, image, figCaption);
            };
            // Create the "move" button on the first work
            const firstFigure = document.getElementsByClassName('modal-figure-works').item(0);
            const moveButton = document.createElement('i');
            moveButton.classList.add('fa-solid', 'fa-up-down-left-right');
            firstFigure.prepend(moveButton);
        })
};

/**
 * Delete works from the API
 */
function deleteWorksData(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'content-type': "application/Json",
            'authorization': "Bearer " + localStorage.getItem("token"),
        },
    })
        .then((response) => {
            if (response.status === 201) {
                displayWorksModal();
                displayWorks();
            };
        });
};

/**
 * Display the modal in works addition mode
 */
function displayModalAddWork() {
    // Get the works deletion modal
    const modalWrapper = document.querySelector('.modal-wrapper-add');
    modalWrapper.style.display = null;
    // Create the navigation element between the two modals
    const modalNav = document.createElement('div');
    modalNav.classList.add('modal-nav');
    // Create the "Go back" button to the previous modal
    const goBackButton = document.createElement('i');
    goBackButton.classList.add('fa-solid', 'fa-arrow-left', 'go-back-button');
    // Create the modal close button
    const closeModalButton = document.createElement('i');
    closeModalButton.classList.add('fa-solid', 'fa-xmark', 'close-modal-button');
    // Create the modal title
    const titleModal = document.createElement('h3');
    titleModal.innerText = 'Add photo';
    // Attach the above elements to the DOM
    modalNav.append(goBackButton, closeModalButton);
    modalWrapper.append(modalNav, titleModal);
    displayFormAddWork();
};

/**
 * Return to the previous modal
 */
function goBackModal() {
    const modalWrapperAdd = document.querySelector('.modal-wrapper-add');
    modalWrapperAdd.style.display = 'none';
    while (modalWrapperAdd.firstChild) {
        modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
    };
    const modalWrapperDelete = document.querySelector('.modal-wrapper-delete');
    modalWrapperDelete.style.display = null;
};

/**
 * Display the work addition form
 */
function displayFormAddWork() {
    // Get the works deletion modal
    const modalWrapper = document.querySelector('.modal-wrapper-add');
    // Create the form
    const formAddWork = document.createElement('form');
    formAddWork.classList.add('form-add-works');
    // Create the form image container
    const containerFormImg = document.createElement('div');
    containerFormImg.classList.add('container-add-img');
    // Create the file preview
    const imgPreview = document.createElement('img');
    imgPreview.classList.add('img-preview');
    imgPreview.src = 'assets/icons/icon-img.png'
    // Create the file label
    const labelAddImgButton = document.createElement('label');
    labelAddImgButton.setAttribute('for', 'file');
    labelAddImgButton.innerText = '+ Add photo';
    // Create the file input
    const addImgButton = document.createElement('input');
    addImgButton.type = 'file';
    addImgButton.setAttribute('id', 'file');
    addImgButton.classList.add('input-image', 'verif-form');
    addImgButton.required = true;
    // Create the file information line
    const infoAddImg = document.createElement('p');
    infoAddImg.innerText = 'jpg, png: max 4MB';
    // Create the form information container
    const containerFormInfo = document.createElement('div');
    containerFormInfo.classList.add('container-form-info');
    // Create the title label
    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'title');
    labelTitle.innerText = 'Title';
    // Create the title input
    let inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('name', 'title');
    inputTitle.setAttribute('id', 'title');
    inputTitle.classList.add('verif-form');
    inputTitle.required = true;
    // Create the category label
    const labelCategory = document.createElement('label');
    labelCategory.setAttribute('for', 'category');
    labelCategory.innerText = 'Category';
    // Create the category select
    const selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'selectCategory');
    selectCategory.classList.add('verif-form');
    selectCategory.required = true;
    // Get category options
    setOptionsSelectForm();
    // Create the submit button
    const validForm = document.createElement('button');
    validForm.classList.add('js-add-works');
    validForm.innerText = 'Submit';
    validForm.style.backgroundColor = '#A7A7A7';
    //validForm.disabled = true;
    // Attach the above elements to the DOM
    modalWrapper.appendChild(formAddWork);
    formAddWork.append(containerFormImg, containerFormInfo, validForm);
    containerFormImg.append(imgPreview, labelAddImgButton, addImgButton, infoAddImg);
    containerFormInfo.append(labelTitle, inputTitle, labelCategory, selectCategory);
    // Add the verification function to change the button color
    verifForm();
};

/**
 * Create options for the category select in the work addition form
 */
function setOptionsSelectForm() {
    fetch(urlCategories)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            data.unshift({
                id: 0,
                name: ''
            });
            for (let category of data) {
                const option = document.createElement('option');
                option.classList.add('cat-option');
                option.setAttribute('id', category.id);
                option.setAttribute('name', category.name);
                option.innerText = category.name;
                const selectCategory = document.getElementById('selectCategory');
                selectCategory.append(option);
            };
        })
};
/**
 * Check the work addition form for button color change
 */
function verifForm() {
    const formAddWork = document.querySelector('.form-add-works');
    const validForm = document.querySelector('.js-add-works');
    const requiredElements = document.querySelectorAll('.verif-form[required]');
    requiredElements.forEach(element => {
        element.addEventListener('input', function () {
            if (formAddWork.checkValidity()) {
                validForm.style.backgroundColor = '#1D6154';
                //validForm.disabled = false;
            } else {
                validForm.style.backgroundColor = '#A7A7A7';
            }
        });
    });
};

/**
 * Send works to the API
 */
function sendData() {
    // Get form values
    const title = document.getElementById('title').value;
    const selectCategory = document.getElementById('selectCategory');
    const choice = selectCategory.selectedIndex;
    const category = selectCategory.options[choice].id;
    const file = document.getElementById('file').files[0];
    // Create formData object
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);

    // Get the token 
    const token = localStorage.getItem('token');
    // Send data to the server with an HTTP POST request
    fetch(urlWorks, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then(response => {
            console.log(response);
            if (response.ok) {
                console.log('Data sent successfully!');
                goBackModal();
                displayWorksModal();
                displayWorks();
            } else {
                console.error('Error sending data: ', response.status);
            }
        })
        .catch(error => console.error('Error sending data: ', error));
};

// Event listings
/**
 * EVENT: Filter works when clicking on the chosen category
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.button-filter')) {
        filterWorks();
    };
});

/**
 * EVENT: Logout when clicking on the logout button
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('#logout')) {
        localStorage.removeItem('token');
    };
});

/**
 * EVENT: Open the modal when clicking on the edit button
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.open-modal')) {
        openModal();
    };
});

/**
 * EVENT: Close the modal when clicking on the close button or outside the modal
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.close-modal-button')) {
        closeModal();
    } else if (event.target.matches('#modal')) {
        closeModal();
    };
});

/**
 * EVENT: Delete works on the modal and index.html when clicking on the trash can
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.delete-work')) {
        deleteWorksData(event.target.id);
        alert('Deletion of work id=' + event.target.id);
        displayWorksModal();
        displayWorks();
    };
})

/**
 * EVENT: Transfer to the work addition modal when clicking on the add photo button
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.link-modal-add')) {
        const modalWrapper = document.querySelector('.modal-wrapper-delete');
        modalWrapper.style.display = 'none';
        displayModalAddWork();
    };
});

/**
 * EVENT: Return to the work deletion modal when clicking on the arrow
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.go-back-button')) {
        goBackModal()
    };
});

/**
 * EVENT: Get the file and update the preview when clicking on the validate button
 */
document.addEventListener('change', function (event) {
    if (event.target.matches('.input-image')) {
        const imgPreview = document.querySelector('.img-preview');
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file.size <= 4 * 1024 * 1024) {
            reader.addEventListener('load', () => {
                imgPreview.src = reader.result;
            });
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            alert('File size must be less than 4 MB');
        };
    };
}); 

/**
 * EVENT: Send form data when clicking on the submit button
 */
document.addEventListener('click', function (event) {
    if (event.target.matches('.js-add-works')) {
        const formAddWorks = document.querySelector('.form-add-works');
        if (formAddWorks.checkValidity()) {
            sendData();
            displayWorks();
        }
    };
});

/**
 * Trigger functions on page load
 */
async function init() {
    displayWorks();
    await displayFilters();
    displayAdminMode();
};

init();
