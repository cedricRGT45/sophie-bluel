//pour appendchild(figcaption)ne fonctionne pas?

import { generateWorks } from "./works.js";
import { generateFilters } from "./filters.js";

const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();

generateWorks(works);
generateFilters();
