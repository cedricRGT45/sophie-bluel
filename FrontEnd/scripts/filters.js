import { generateWorks } from "./works.js";

const apiCategories = await fetch("http://localhost:5678/api/categories");
const categories = await apiCategories.json();
const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();
//generating categories'filters

export async function generateFilters() {
  for (let i = 0; i < categories.length; i++) {
    const filters = document.createElement("button");
    filters.classList.add("filters");
    // Adding the ID regarding the attribute data-id
    filters.setAttribute("data-id", works[i].categoryId);
    filters.textContent = categories[i].name;
    filtersBar.appendChild(filters);
  };

// creating event listener for each filter button
document.querySelectorAll(".filters").forEach((filterButton) => {
  filterButton.addEventListener("click", function (event) {
    for (let i =0; i < works.length; i++){
      const categoryButton = event.target.dataset.id;
      const categoryWorks = works.categoryId;
      const categoryFiltered = works.filter(function (work) {
        return work.category.id === parseInt(categoryButton)
      })
      gallery.innerHTML = ""
      generateWorks(categoryFiltered)
    };
  });
})
//creating a button reset the gallery section
const resetButton = document.createElement("button")
resetButton.textContent = "Tous"
console.log(resetButton)
resetButton.classList.add("btnAll", "filters")
filtersBar.prepend(resetButton)
document.querySelector(".btnAll").addEventListener("click", function (item) {
  gallery.textContent = "";
  generateWorks(works);})
}
