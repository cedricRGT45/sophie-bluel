import { generateWorks } from "./works.js";
import { generateFilters } from "./filters.js";
import { loggedIn} from "./login.js"
import { displayAdminMode} from "./login.js"

const apiWorks = await fetch("http://localhost:5678/api/works");
const works = await apiWorks.json();

generateWorks(works);
generateFilters();
loggedIn()
displayAdminMode()
