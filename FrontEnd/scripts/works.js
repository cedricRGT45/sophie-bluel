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

//Function allowing to open the modal which will update the gallery
export async function modalGallery() {
  if (localStorage.getItem("token")) {
    const btnModifier = document.querySelector(".btn-modify");
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
        titleModal.classList.add("modal__title");
        titleModal.textContent = "Galerie photo";
        titleModal.style.color = "#000";
        titleModal.style.font = "400 1.62rem Work Sans";
        portfolioUpdateModal.prepend(titleModal);

        for (let i = 0; i < item.length; i++) {
          //creating the element tags

          //to generate the image container
          let figureModal = document.createElement("figure");
          figureModal.classList.add("image-modal");

          //To create the delete button
          const binModal = document.createElement("span");
          binModal.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
          binModal.classList.add("bin");
          binModal.setAttribute("data-id", works[i].id);
          //To insert the photo
          let imageModal = document.createElement("img");
          imageModal.src = item[i].imageUrl;

          //Adding the elements to the modal
          figureModal.appendChild(imageModal);
          figureModal.appendChild(binModal);
          galleryModal.appendChild(figureModal);
          portfolioUpdateModal.appendChild(galleryModal);

          //To add a click event on the bin to remove image
          binModal.addEventListener("click", async () => {
            const workId = binModal.getAttribute("data-id");
        const token = localStorage.getItem("token")
            try {
              // Envoi de la requête DELETE à l'API
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
                // Suppression réussie, mettez à jour la galerie principale
                const workToRemove = document.querySelector(
                  `[data-id="${workId}"]`)
                  gallery.remove(workToRemove);
                  const workModalToRemove = document.querySelector(
                    `[data-id="${workId}"]`)
                    galleryModal.remove(workModalToRemove.parentElement);
                    console.log("Travail supprimé avec succès !");
                    generateWorks()
                    GenerateModalGallery()
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

        //To create the Add photo's button
        let addBtn = document.createElement("button");
        addBtn.classList.add("btn", "btn__addPhoto");
        addBtn.textContent = "Ajouter une photo";
        portfolioUpdateModal.appendChild(addBtn);
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
