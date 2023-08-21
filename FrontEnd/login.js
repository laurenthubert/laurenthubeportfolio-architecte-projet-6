//constantes
const inputs = document.querySelectorAll("input");
const messageerreur = document.querySelector(".message_erreur");
const boutonconnecter = document.querySelector(".bouton_connecter");

//envoyer la demmande de connexionmode , methode d'envoie , elements envoyes
function demmandeconnexion() {
  const valeuremail = inputs[0].value;
  const valeurmdep = inputs[1].value;
  let demmandeconnexion = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: valeuremail,
      password: valeurmdep,
    }),
    mode: "cors",
    credentials: "same-origin",
  };
//comparer les identifiants et action a effectuer//recuperation des elementsdans l'api
  fetch("http://localhost:5678/api/users/login", demmandeconnexion)
    .then((res) => res.json())
    .then((data) => {
      let token = data.token; //stocage des elements de l'api
      localStorage.setItem("Token", token); //setItem ajout au stocage
      if (token) {
        window.location.href = "./index.html";
      } else {
        messageerreur.style.visibility = "visible";
        localStorage.removeItem("Token"); //supression du token pour ne pas acceder a la page projet en cliquant dans projet sur le header
      }
    });
}

//mode de demmande de validation
//au clavier
inputs.forEach(() => {
  boutonconnecter.addEventListener("keydown", (e) => {//demmande de validation par le clavier
    if (e.key === "Enter") {//choix de la touche 
      demmandeconnexion();
    }
  });
});
//au click
boutonconnecter.addEventListener("click", demmandeconnexion);
