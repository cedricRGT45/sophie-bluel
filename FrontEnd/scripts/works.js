import { loggedIn } from "./login.js";
loggedIn();

const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();
const gallery = document.querySelector(".gallery");
const filtersBar = document.getElementById("filters-bar");
const portfolioModal = document.querySelector(".portfolio__modal");

//generating image from the API in the gallery

//initializing gallery content
export async function generateWorks(item) {
  for (let i = 0; i < item.length; i++) {
    //creating the element tags
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    image.src = item[i].imageUrl;
    let figcaption = document.createElement("figcaption");
    figcaption = item[i].title;

    //Adding the elements to the gallery div
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.append(figcaption);
  }
}

//Function creating the update modal
export async function modalGallery() {
  if (sessionStorage.getItem("token")) {
    const btnModifier = document.querySelector(".btn__modify");
    const portfolioUpdateModal = document.querySelector(
      ".portfolio__modal-update"
    );
    const closeButton = document.createElement("i");

    //To show the modal
    btnModifier.addEventListener("click", function () {
      function GenerateModalGallery(item) {
        //To create a close button
        closeButton.classList.add("btn-close");
        closeButton.innerHTML = `<i class="fa-solid fa-x"></i>`;
        portfolioUpdateModal.appendChild(closeButton);
        portfolioUpdateModal.showModal();

        //To create the modal gallery

        //to generate the gallery container
        let galleryModal = document.createElement("div");
        galleryModal.classList.add("gallery-modal");

        //to create the modal title
        const titleModal = document.createElement("h3");
        titleModal.textContent = "Galerie photo";
        titleModal.style.color = "#000";
        titleModal.style.font = "400 1.62rem Work Sans";
        portfolioUpdateModal.insertBefore(
          titleModal,
          portfolioUpdateModal.firstChild
        );

        for (let i = 0; i < item.length; i++) {
          //creating the element tags

          //to generate the image container
          const figureModal = document.createElement("figure");
          figureModal.classList.add("image-modal");

          //To create the delete button
          const binModal = document.createElement("span");
          binModal.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
          binModal.classList.add("bin");
          binModal.setAttribute("data-id", works[i].id);
          //To insert the photo
          const imageModal = document.createElement("img");
          imageModal.src = item[i].imageUrl;

          //Adding the elements to the modal
          figureModal.appendChild(imageModal);
          figureModal.appendChild(binModal);
          galleryModal.appendChild(figureModal);
          portfolioUpdateModal.appendChild(galleryModal);

          //To add a click event on the bin to remove image
          binModal.addEventListener("click", async () => {
            const workId = binModal.getAttribute("data-id");
            const token = sessionStorage.getItem("token");
            try {
              // To send the deleting request to the API
              const response = await fetch(
                `http://localhost:5678/api/works/${workId}`,
                {
                  method: "DELETE",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                // If deletion succesful then remove the item
                const workToRemove = document.querySelector(
                  `[data-id="${workId}"]`
                );
                gallery.remove(workToRemove);
                const workModalToRemove = document.querySelector(
                  `[data-id="${workId}"]`
                );
                galleryModal.remove(workModalToRemove.parentElement);
                console.log("Travail supprimé avec succès !");
                generateWorks(workToRemove);
                GenerateModalGallery(workModalToRemove);
              } else {
                {
                  const modalAlert = document.createElement("dialog");
                  modalAlert.classList.add("modal__login-alert");
                  modalAlert.textContent = "veuillez vous reconnecter";
                  modalAlert.showModal();
                }
              }
            } catch (error) {
              console.error("Erreur inattendue :", error);
            }
          });
        }
        //to create the separation line
        const separationLine = document.createElement("span");
        separationLine.classList.add("modal__separationLine");
        portfolioUpdateModal.appendChild(separationLine);

        //To create the add photo's button
        const addButton = document.createElement("button");
        addButton.classList.add("btn", "btn__addPhoto");
        addButton.textContent = "Ajouter une photo";
        addButton.style.cursor = "pointer";
        portfolioUpdateModal.appendChild(addButton);

        addButton.addEventListener("click", function () {
          //To modify the element for the upload div
          addButton.style.display = "none";
          galleryModal.style.display = "none";
          titleModal.textContent = "Ajout Photo";

          //To create the elements for the ulpload div

          //To create the container to upload the picture
          const uploadDiv = document.createElement("div");
          uploadDiv.classList.add("upload__div");

          //To create the container to preview the uploaded picture
          const pictureUploadDiv = document.createElement("input");
          pictureUploadDiv.setAttribute("type", "image")
          pictureUploadDiv.classList.add("upload__div-picture");
          pictureUploadDiv.src = "../assets/icons/icon-picture.svg";

          //To create the button to upload the picture
          const labelUploadDiv = document.createElement("label");
          labelUploadDiv.classList.add("btn", "upload__div-validateButton");
          labelUploadDiv.setAttribute("for", "input-upload");
          labelUploadDiv.textContent = "+ Ajouter photo";
          const inputUploadDiv = document.createElement("input");
          inputUploadDiv.setAttribute("id", "input-upload");
          inputUploadDiv.setAttribute("type", "file");
          inputUploadDiv.setAttribute("accept", "image/jpg, image/png");
          inputUploadDiv.style.display = "none";

          //To create the info text for image type
          const subtitleUploadDiv = document.createElement("p");
          subtitleUploadDiv.textContent = "jpg, png : 4mo max";
          subtitleUploadDiv.classList.add("upload__div-subtitle");

          //To create the container for the inputs document's information fields
          const documentsInformationsContainer = document.createElement("form");
          documentsInformationsContainer.setAttribute(
            "id",
            "informations-fields"
          );

          //To create the title input field
          const labelUploadTitle = document.createElement("label");
          labelUploadTitle.setAttribute("for", "upload__div-inputTitle");
          labelUploadTitle.setAttribute("value", "test")
          labelUploadTitle.textContent = "Titre";
          labelUploadTitle.classList.add("upload__div-labelInformation");
          const inputUploadTitle = document.createElement("input");
          inputUploadTitle.setAttribute("type", "texte");
          inputUploadTitle.setAttribute("id", "upload__div-inputTitle");
          inputUploadTitle.classList.add("upload__div-inputInformation");

          //To create the category input field
          const labelUploadCategory = document.createElement("label");
          labelUploadCategory.setAttribute(
            "for",
            "upload__div-inputCategoInformationry"
          );
          labelUploadCategory.textContent = "Catégorie";
          labelUploadCategory.classList.add("upload__div-labelInformation");
          const inputUploadCategory = document.createElement("input");
          inputUploadCategory.setAttribute("type", "texte");
          inputUploadCategory.setAttribute("id", "upload__div-inputCategory");
          inputUploadCategory.classList.add("upload__div-inputInformation");

          //To create the submit button
          const buttonUpload = document.createElement("button");
          buttonUpload.classList.add("btn", "upload__div-buttonUpload");
          buttonUpload.setAttribute("id", "btn-upload");
          buttonUpload.textContent = "Valider";

          //To link the element to the dom
          uploadDiv.appendChild(pictureUploadDiv);
          uploadDiv.appendChild(labelUploadDiv);
          uploadDiv.appendChild(inputUploadDiv);
          uploadDiv.appendChild(subtitleUploadDiv);
          documentsInformationsContainer.prepend(
            labelUploadTitle,
            inputUploadTitle,
            labelUploadCategory,
            inputUploadCategory,
            separationLine,
            buttonUpload
          );
          portfolioUpdateModal.prepend(
            titleModal,
            uploadDiv,
            documentsInformationsContainer
            );
            
          //To load the picture in the preview container
          inputUploadDiv.addEventListener("change", function () {
            const allowedFormats = ["image/jpeg", "image/png"];

            if (!allowedFormats.includes(inputUploadDiv.files[0].type)) {
              subtitleUploadDiv.textContent =
                "SEULEMENT LES FICHIERS EN .JPG OU .PNG SONT ACCEPTÉS";
              subtitleUploadDiv.style.color = "#1d6154";
              subtitleUploadDiv.style.fontWeight = "900";
              pictureUploadDiv.src = "../assets/icons/icon-picture.svg";
            } else {
              subtitleUploadDiv.style.display = "none";
              labelUploadDiv.style.display = "none";
              pictureUploadDiv.src = URL.createObjectURL(
                inputUploadDiv.files[0]
              );
              pictureUploadDiv.style.width = "8.06rem";
              pictureUploadDiv.style.height = "12.06rem";
            }
          });
        });
      }
      //To generate the gallery in the parent div
      portfolioUpdateModal.innerHTML = "";
      GenerateModalGallery(works);
    });

    //To close the modal on clicking on the close button or outside of the modal
    closeButton.addEventListener("click", function () {
      portfolioUpdateModal.close();
    });
    window.onclick = function (event) {
      if (event.target === portfolioUpdateModal) {
        portfolioUpdateModal.close();
      }
    };
  }
}

