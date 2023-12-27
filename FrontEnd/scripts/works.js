const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();

const gallery = document.querySelector(".gallery");

//generating image from the API in the gallery

export async function generateWorks() {
  for (let i = 0; i <= works.length; i++) {
    //initializing gallery content
    //creating the element tags
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    image.src = works[i].imageUrl;
    let figcaption = document.createElement("figcaption");
    figcaption = works[i].title;
    //Adding the elements to the gallery div
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.append(figcaption);
  }
}
