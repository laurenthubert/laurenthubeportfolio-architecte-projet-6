//liste des constantes
const travaux = document.querySelector(".gallery");
const filtres = document.querySelectorAll(".filtre");
const login = document.querySelector(".login_logout");
const goupedesfiltres = document.querySelector(".groupefiltre");
const boutonsdesmodal = document.querySelectorAll(".bouton_modal");
const modal = document.querySelector("dialog");
const ouverturefenetre = document.querySelector(".js_ouvrefenetre");
const fermedialoge = document.querySelector(".position_icon_croix");
const affichagetraveauxmodal = document.querySelector(".images_modal");
const contenufenetreajout = document.querySelector(".modal_boite");
const bannierevisible = document.querySelector(".banniere");

//liste des variable
let listedetravaux = [];
let categories = [];

//contact avec l'API pour la liste de travaux
function importdestravaux() {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      listedetravaux = data;
      affichagetravaux(listedetravaux); // Appel de la fonction après avoir récupéré les données
      affichagedestravauxhtml(listedetravaux); //appel de la fonction pour mettre a jour
    });
}
importdestravaux(); //declanchement de la fonction pour la recuperation dan la fonction affichagedestravaux

//insertion des travaux de l'api
function affichagedestravauxhtml(listedetravaux) {
  travaux.innerHTML = ""; //suppression du html existant
  listedetravaux.forEach((travail) => {//faire le tour de tous les elements et a chaque element=>
    
    const figure = document.createElement("figure"); //creation de la balise figure
    travaux.appendChild(figure); //ajout de la balise
    figure.setAttribute("data-id", travail.id); //ajoute d'un attribut

    const image = document.createElement("img"); //ajout de l'image dans la balise figure
    image.src = travail.imageUrl; //ajout du lien
    image.alt = travail.title;
    figure.appendChild(image); //ajout de la balise

    const figcaption = document.createElement("figcaption"); //ajout du texte dans la balise figure
    figcaption.innerHTML = travail.title; //ajout du lien
    figure.appendChild(figcaption); //ajout de la balise
  });
}

//fonction pour le tri par categorie
function triparfiltre() {
  filtres.forEach((filtre) => {//faire le tour des filtres
    const valeurdufitre = filtre.textContent; //donner une valeur

    filtre.addEventListener("click", () => {//au click
      filtres.forEach((filtre) => {//faire le tour des filtres
        filtre.classList.remove("filtre_actif"); //supprimer la class
      });
      let tableaudufiltre = []; //resulat a afficher etant un tableau
      if (valeurdufitre === "Tous") {//definir un premier tri
        tableaudufiltre = listedetravaux; //resultat a afficher
        filtre.classList.add("filtre_actif"); //ajouter la class
      } else {//autre tri
        tableaudufiltre = listedetravaux.filter(//condition pour l'ensemble des autres trie
          (travailaafficher) => travailaafficher.category.name === valeurdufitre //retourne  tableau avec les travaux valeur filtre =valeur categorie
        );
        filtre.classList.add("filtre_actif"); //ajout de la class
      }
      affichagedestravauxhtml(tableaudufiltre); //declancher de la fonction insertion des travaux dans le html
    });
  });
}
triparfiltre(); //declanchement de fonction pour le tri par categorie

/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// utilisateur connecté///////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//verification de la connection
let token = localStorage.getItem("Token"); //stocage du token valide

// mode de deconnection
if (token) {
  login.addEventListener("click", () => {//au click sur logout
    localStorage.removeItem("Token"); //supprimer le token
  });
}

//fonction pour transformation du logout et les modification filtre et bouton modal
function modifhtml() {
  bannierevisible.style.display = "flex"; //affichage de la banniere
  login.innerHTML = "logout"; //changement du login en logout
  goupedesfiltres.innerHTML = ""; //suppression des filtres
  boutonsdesmodal.forEach((button) => {//faire le tour des boutons  modifier
    button.style.display = "flex"; //faire apparaitre les boutons
  });
}//fonction appellee plus tard

if (token) {//verifier la validitee du token
  modifhtml(); //declancher les modif
}

//apparition de la fenetre dialog au click sur modifier
function ouverture() {
  ouverturefenetre.addEventListener("click", () => {//mode de declanchement
    modal.showModal(); //ouverture de la modal
  });
}
ouverture(); //declanchement de la fonction

//fermeture de la fenetre dialoge (croix , click exterieur , echap)
function fermeture() {
  fermedialoge.addEventListener("click", () => {//mode de declanchement sur la croix
    modal.close();
  });
  window.addEventListener("click", (e) => {//mode de declanchement hors fenetre
    if (e.target === modal) {
      modal.close();
    }
  });
  window.addEventListener("keydown", function (e) {//mode de declanchement clavier
    if (e.key === "escape") {
      modal.close();
    }
  });
}
fermeture(); //declanchement de la fonction

//affichage des travaux dans la modal
function affichagetravaux(listedetravaux) {//reprendre fetch
  let contenuaffichage = ""; //variable pour contenir les travaux a afficher
  listedetravaux.forEach((travail) => {//faire le tour de tous les elements
    contenuaffichage += `<!---------------------------------------------------------------------------------------a chaque element creer-->
          <div class="position_travail_modal">
              <img src="${travail.imageUrl}"><!-------------------------------------------------------------------image avec le lien-->
              <i class="fa-regular fa-trash-can icon_trash" data-id="${travail.id}"></i><!------------------------poubelle avec ID pour la suppresion-->
              <i class="fa-solid fa-arrows-up-down-left-right icon_arrow"></i><!----------------------------------fleche de deplacement-->
              <p>éditer</p>
          </div>
      `;
  });
  affichagetraveauxmodal.innerHTML = contenuaffichage; //affichage de l'ensemble des elements

  const iconsuppression = document.querySelectorAll(".icon_trash"); //constant apres la creation du html

  //suppression des travaux dans la modal
  let demandesuppression = {

    method: "DELETE", //autorisation avec verification du token
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  iconsuppression.forEach((trash) => {//faire le tour des poubelles
    trash.addEventListener("click", () => {//au click

      const travailID = trash.getAttribute("data-id"); //variable qui releve ID

      fetch(`http://localhost:5678/api/works/${travailID}`, demandesuppression) //envoi a l'API delet
        .then((res) => {
          if (res.ok) {//si reponse valide
            trash.parentElement.remove(); //supprime les elements dans la fenetre
            const miseajourhtml = document.querySelector(`figure[data-id="${travailID}"]`
            ); 
            miseajourhtml.remove();///mettre a jour l'affichage
          }
        });
    });
  });
}

///////////////////////////////////////
//creation ajout des nouveaux travaux
/////////////////////////////////////

//contacte avec l'API categorie
function importdescategories() {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      categories = data; //liste des caregories
    });
}
importdescategories(); //declanchements de la fonction

//ajouter une liste categorie
function generercategorie() {
  let categorieHTML = ""; //variable pour contenir categories
  categories.forEach((category) => {//faire le tour de la liste recu
    categorieHTML += `<option value="${category.id}">${category.name}</option>`; //creer le html a chaque categorie avec le nom et ID
  });
  return categorieHTML; //renvoi la variable conpletee
} //fonction appellee plus tard

//fenetre pour l'ajout de travaux
function fenetreajoutdetravaux() {
  let contenuajoutdetraveauxHTML = ""; //variable pour contenir la page ajout de travail
  const boutonfenetreajout = document.querySelector(".modal_ajouter");

  boutonfenetreajout.addEventListener("click", () => {//au click sur ajouter une photo
    contenuajoutdetraveauxHTML = contenufenetreajout.innerHTML; //suppression du html existant
    contenufenetreajout.innerHTML = "";//creation de la page
    contenufenetreajout.innerHTML = `
          <i class="fa-solid fa-arrow-left modal_fleche_retour"></i>
          <div class="modal_ajout_de_travaux">
              <h3>Ajout photo</h3>
              <form class="validation_couleur" action=""> 
                  <div class="modal_ajout_image">
                      <i class="fa-sharp fa-regular fa-image "></i>
                       <img src="" class="image_selectionne">
                      <label for="photo" class="forme_ajouter_photo">+ Ajouter photo</label>
                      <input type="file" id="photo" name="photo">
                      <p>jpg, png : 4mo max</p>
                  </div>
                  <div>
                      <div class="modal_ajout_titre_categorie">
                          <label for="titre">Titre</label>
                          <input type="text" id="titre" name="titre" autocomplete="off">
                      </div>
                      <div class="modal_ajout_titre_categorie">
                          <label for="categorie">Catégorie</label>
                          <select name="categorie" id="categorie">
                              <option value=""></option>          <!------------------------------------------------------->
                              ${generercategorie()}               <!--import de la fonction pour afficher les categories--->
                          </select>                               <!------------------------------------------------------->
                      </div>
                  </div>
              </form>
              <p class="message_remplir_champs">Veuillez remplir tous les champs pour ajouter un projet</p>
              <p class="message_valide">Formulaire enregistré !</p>
              <p class="message_erreure_envoi">Une erreur s'est produite lors de la soumission du formulaire</p>
              <span class="ligne"></span>
              <button class="bouton_valide_ajout" disabled >Valider</button>
          </div>
      `;

    //constant apres la creation du html
    const modalflecheretour = document.querySelector(".modal_fleche_retour");
    const imageselectionne = document.querySelector(".image_selectionne");
    const nouvellephoto = document.getElementById("photo");
    const nouveautitre = document.getElementById("titre");
    const nouvellecategorie = document.getElementById("categorie");
    const remplirchamps = document.querySelector(".message_remplir_champs");
    const messagevalide = document.querySelector(".message_valide");
    const erreureenvoi = document.querySelector(".message_erreure_envoi");
    const valideajout = document.querySelector(".bouton_valide_ajout");

    //retour sur la modale
    modalflecheretour.addEventListener("click", () => {//au click sur la fleche
      contenufenetreajout.innerHTML = contenuajoutdetraveauxHTML; //supprime le html
      fenetreajoutdetravaux(); //permet d'aller et de revenir sur la fenetre
    });

    //Affichage de l'image lors de sa selection
    nouvellephoto.addEventListener("change", () => {//au changemant dans l'affichage du html

      const file = nouvellephoto.files[0];  //
      const reader = new FileReader();     //permet de lire l'image
      reader.onload = (e) => {            //
        
        imageselectionne.src = e.target.result; //envoi l'image selectionnee a son emplacement

        const nouvelleimage = document.querySelector(".modal_ajout_image"); // div de l'emplacement de la nouvelle image
        const formElements = nouvelleimage.querySelectorAll(".modal_ajout_image > *" ); //supprime les elements mais pas le css

        formElements.forEach((element) => {
          element.style.display = "none"; //cache les elements
        });
        imageselectionne.style.display = "flex"; //affiche l'image
      };
      reader.readAsDataURL(file); //permet de lire l'image
    });

    //fonction pour le changement du bouton valide
    
    function boutonvalidecouleur() {
      const photo = document.querySelector("#photo");
      const titre = document.querySelector("#titre").value;
      const type = document.querySelector("#categorie").value;
      const boutonok = document.querySelector(".bouton_valide_ajout");

      if (photo.value && titre !== "" && type !== "") {//condition requise
        boutonok.classList.add("bouton_valide_ajout_color"); //changemant de couleur
        boutonok.removeAttribute("disabled"); //debloquage du bouton
      } else {
        boutonok.classList.remove("bouton_valide_ajout_color"); //ne pas changer la couleur
        boutonok.setAttribute("disabled", true); //blocage du bouton
      }
    }

document.querySelector(".modal_ajout_de_travaux").addEventListener("input", boutonvalidecouleur);//mode de modification du bouton valider

    ///////////////////////mettre a jour l'affichage////////////////////////////////////////////////////////////
    async function recupererDonneesSoumises(formData) {
      try {
        const reponse = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,//verification d'autorisation 
          },
          body: formData, //contient les données a envoyer
        });
        if (reponse.ok) {
          const donnees = await reponse.json();// Convertit la réponse en format JSON
          return donnees; //données renvoyées par l'API après la soumission
        } else {
          throw new Error("Erreur lors de la soumission des données à l'API");//message d'erreure
        }
      } catch (erreur) {
        console.error("Une erreur s'est produite :", erreur);//message "Une erreur s'est produite suivi du détail de l'erreur 
        return null;// indique qu'une erreur s'est produite et qu'on ne peux pas continuer 
      }
    }

    function fermerModalEtActualiser() {
      setTimeout(() => {
        location.reload(); // Recharge la page
      }, 2000);
    }

    // ajout de travaux
    function creationnouveautravaux() {
      valideajout.addEventListener("click", async () => {//au click sur valider

        if (  nouvellephoto.value === "" || nouveautitre.value === "" || nouvellecategorie.value === "" //controler que les trois champs sont rempli
        ) {
          remplirchamps.style.display = "block";  //si non informer l'utilisateur
          return;// stop la fonction
        }

        const formData = new FormData(); // variable pour stocker le nouveau travail (construit cle/valeur)

        formData.append("image", nouvellephoto.files[0]);      //
        formData.append("title", nouveautitre.value);          //enregistrer les nouvelles valeurs
        formData.append("category", nouvellecategorie.value);  //

        const Donnéessoumises = await recupererDonneesSoumises(formData);
        if (Donnéessoumises !== null) {
          remplirchamps.style.display = "none";
          messagevalide.style.display = "block";

          importdestravaux();//mise a jour de la page

          // Fermer la modal après 2 secondes
          valideajout.setAttribute("disabled", true); // Désactive le bouton "Valider"
          fermerModalEtActualiser(); // Appelle la fonction pour fermer la modal et actualiser la page
        } else {
          remplirchamps.style.display = "none";
          erreureenvoi.style.display = "block";
          console.error("La soumission des données a échoué");
        }
      });
    }
    creationnouveautravaux();// Appel initial de la fonction
  });
}
fenetreajoutdetravaux();// Appel initial de la fonction
