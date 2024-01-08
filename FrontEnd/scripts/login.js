// faut il créer entiérement les modales et header avec js dans le gestionnaire d'événement?

//Checking the mail and password input

// Creating a listener for the submit form to verify the email and password
export async function loggedIn() {
  const modalLoginAlert = document.querySelector(".modal__login");
  document
  .querySelector(".login__form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Stop the form from reloading
    
    // Retrieve values from email and password inputs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      // Attempt to log in user by calling the loginUser function
      const response = await loginUser(email, password);
      // Check the status of the response
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", response.token);
        window.location.replace(`index.html`);
        } else {
          // If unsuccessful, display an error alert
          modalLoginAlert.style.display = "flex";
          modalLoginAlert.classList.add("modal-animation");
        }
      } catch (error) {
        // Handle any errors that may occur during the login process and display an error alert
        alert(`Error: ${error.message}`);
      }
    });

  //remove the modal on outside click
  window.onclick = function (event) {
    if (event.target == modalLoginAlert) {
      modalLoginAlert.style.display = "none";
      modalLoginAlert.classList.remove("modal-animation");
    }
  };
  document.querySelector(".btn-tryId").addEventListener("click", function () {
    modalLoginAlert.style.display = "none";
    modalLoginAlert.classList.remove("modal-animation");
  });

  // Function to send a login request to the server
  async function loginUser(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Log the response to the console and return it
    console.log(response);
    return response;
  }
}

export function displayAdminMode() {
  if (localStorage.getItem('token')){
    const header = document.querySelector("#header-admin")
    const adminHeader = document.createElement("div")
    adminHeader.classList.add("edit__bar")
    adminHeader.innerHTML = `<i class="fa-regular fa-pen-to-square">
		</i>
		<p>Mode édition</p>`
    header.prepend(adminHeader)

    const titleBar = document.querySelector(".title__bar")
    const btnUploadGallery = document.createElement("div")

    btnUploadGallery.innerHTML=`<i class="fa-regular fa-pen-to-square">
    </i>
    <p>Modifier</p>`
    titleBar.appendChild(btnUploadGallery)

    document.getElementById("btn-login").innerHTML = "Log Out"
    document.getElementById("btn-login").addEventListener("click", function(){
      localStorage.removeItem('token')
    })
  }
}
