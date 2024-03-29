//to create a modal alert when the response is not correct
export async function modalAlert(message) {
  const modalAlert = document.createElement("dialog");
  modalAlert.classList.add("modal__alert");
  modalAlert.textContent = message;
  const exitModalBtn = document.createElement("button");
  exitModalBtn.classList.add("modal__alert-btn");
  exitModalBtn.textContent = "Retour";
  modalAlert.appendChild(exitModalBtn);
  const loginSection = document.getElementById("login");
  loginSection.appendChild(modalAlert);
  modalAlert.showModal();

  exitModalBtn.addEventListener("click", function (event) {
    event.preventDefault();
    modalAlert.close();
    modalAlert.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target === modalAlert) {
      event.preventDefault();
      modalAlert.close();
      modalAlert.style.display = "none";
    }
  };
}

// Retrieving the form element
const form = document.querySelector("form");

/**
 * Login
 * @param {string} event Click on the login button
 */
async function onSubmit(event) {
  event.preventDefault();
  // Defining user credentials
  let user = {
    email: form.email.value,
    password: form.password.value,
  };

  // Fetching data from the API
  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });

  let result = await response.json();

  // If the credentials are correct
  if (response.status === 200) {
    sessionStorage.setItem("token", result.token);
    window.location.replace(`index.html`);
    // Otherwise, if the credentials are incorrect
  } else if (response.status === 404 || response.status === 401) {
    form.email.value = "";
    form.password.value = "";
    modalAlert("Mot de passe et/ou e-mail incorrect");
  }
}

//To show the modal error message

form.addEventListener("submit", onSubmit);

const body = document.querySelector("body");
body.style.height = "100%";
