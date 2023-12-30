const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();
const gallery = document.querySelector(".gallery");
const filtersBar = document.getElementById("filters-bar");

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


