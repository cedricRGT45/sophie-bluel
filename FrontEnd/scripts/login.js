//session.storage

//Checking the mail and password input

// Creating a listener for the submit form to verify the email and password
export async function loggedIn() {
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
  
    console.log(response);
    return response;
  }
  const modalLoginAlert = document.querySelector(".modal__login-alert");
  document.querySelector(".login__form").addEventListener("submit", async function (event) {
      event.preventDefault(); // Stop the form from reloading

      // Retrieve values from email and password inputs
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Attempt to log in user by calling the loginUser function
        const response = await loginUser(email, password);
        // Check the status of the response
        if (response.status === 200) {
          const responseData = await response.json();
          localStorage.setItem("token", responseData.token);
          window.location.replace(`index.html`);
          
        } else {
          // If unsuccessful, display an error alert
          modalLoginAlert.showModal(); // allows accesibility by using the keyboard
        }
      } catch (error) {
        // Handle any errors that may occur during the login process and display an error alert
        alert(`Error: ${error.message}`);
      }
      return localStorage.getItem("token")
    });

  //remove the modal on outside click
  window.onclick = function (event) {
    if (event.target === modalLoginAlert) {
      modalLoginAlert.close();
    }
  };
  document.querySelector(".btn-tryId").addEventListener("click", function () {
    modalLoginAlert.close();
  });
}

//Editing of the admin mode

export function displayAdminMode() {
  if (localStorage.getItem("token")) {
    //Creating of the admin header
    const header = document.querySelector("#header-admin");
    const adminHeader = document.createElement("div");
    adminHeader.classList.add("edit__bar");
    adminHeader.innerHTML = `<i class="fa-regular fa-pen-to-square">
		</i>
		<p>Mode édition</p>`;
    header.prepend(adminHeader);

    //creating the update gallery button

    const titleBar = document.querySelector(".title__bar");
    const btnUploadGallery = document.createElement("div");
    btnUploadGallery.classList.add("btn-modify");
    btnUploadGallery.innerHTML = `<i class="fa-regular fa-pen-to-square">
    </i>
    <p>modifier</p>`;
    titleBar.appendChild(btnUploadGallery);

    //To logout the admin page
    document.getElementById("btn-login").innerHTML = "Log Out";
    document.getElementById("btn-login").addEventListener("click", function () {
      localStorage.removeItem("token");
    });
  }
}
