const apiCategories = await fetch("http://localhost:5678/api/categories")
const categories = await apiCategories.json();


//generating categories'filters
const filtersBar = document.getElementById("filters-bar");
export async function generateFilters() {
  for (let i=0; i<= categories.length; i++){
  const filters = document.createElement("button");
  filters.classList.add("filters")
  filters.textContent = categories[i].name;
  filtersBar.appendChild(filters)
console.log(filters)
}
}

//creating a listener

filters