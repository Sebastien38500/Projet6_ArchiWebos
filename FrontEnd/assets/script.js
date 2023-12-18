const url = "http://localhost:5678/api/works"
const container = document.querySelector(".gallery");  
const token = localStorage.getItem("token"); 


const boutonTous = document.createElement("button");  // création des filtres
boutonTous.innerText = "Tous";
const boutonObjets = document.createElement("button");
boutonObjets.innerText = "Objets";
const boutonAppartements = document.createElement("button");
boutonAppartements.innerText = "Appartements";
const boutonHotelsRestaurants = document.createElement("button");
boutonHotelsRestaurants.innerText = "Hôltels & Restaurants";

const divFiltres = document.querySelector(".filtres");

divFiltres.append(boutonTous, boutonObjets, boutonAppartements, boutonHotelsRestaurants);

const allBtn = divFiltres.querySelectorAll("*");


let allProjets = [];


const getProjets = () => {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allProjets = data;
            gallery(allProjets);
        })

    boutonObjets.addEventListener("click", function () {
        const filtreObjets = allProjets.filter(function (a) {
            return a.category.id ==1 ;
        });
        allBtn.forEach(btn => {
            btn.classList.remove("select")
        })
        boutonObjets.classList.add("select");
        container.innerHTML = "";x
        gallery(filtreObjets);
    });
    boutonAppartements.addEventListener("click", function () {
        const filtreAppartements = allProjets.filter(function (a) {
            return a.category.id == 2;
        });
        allBtn.forEach(btn => {
            btn.classList.remove("select")
        })
        boutonAppartements.classList.add("select")
        container.innerHTML = "";
        gallery(filtreAppartements);
    });
    boutonHotelsRestaurants.addEventListener("click", function () {
        const filtreHotelsRestaurants = allProjets.filter(function (a) {
            return a.category.id == 3;
        });
        allBtn.forEach(btn => {
            btn.classList.remove("select")
        })
        boutonHotelsRestaurants.classList.add("select")
        container.innerHTML = "";
        gallery(filtreHotelsRestaurants);
    });
    boutonTous.addEventListener("click", function () {
        allBtn.forEach(btn => {
            btn.classList.remove("select")
        })
        boutonTous.classList.add("select")
        gallery(allProjets);
    });
};

// Fonction pour afficher les projets dans la galerie en fonction des données filtrées
const gallery = (filteredData) => {
    container.innerHTML = "";
    for (const projet of filteredData) {
        const element = document.createElement("figure");
        element.classList.add(`js-projet-${projet.id}`);
        const image = document.createElement("img");
        const caption = document.createElement("figcaption");
        image.src = projet.imageUrl;
        image.alt = projet.title;
        caption.innerText = projet.title;
        element.appendChild(image);
        element.appendChild(caption);
        container.appendChild(element);
    }
};
getProjets();


///////////////////////////// Ouverture de la modale /////////////////////////////
let modale = null

const openModale = function (e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute("href"))
    modale.style.display = null
    modale.removeAttribute("aria-hidden")

    modaleProjets();

    document.querySelectorAll(".js-btn-ajouter").forEach(b => {
        b.addEventListener("click", openModale2)
    })

    // Appel fermeture modale
    modale.addEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
}

// Element qui ouvre la modale
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
})


// Fermeture de la modale
const closeModale = function (e) {
    e.preventDefault()
    if (modale === null) return


    modale.style.display = "none"
    modale.setAttribute("aria-hidden", "true")

    modale.removeEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").removeEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)
    modale = null
}

// Définit la "border" du click pour fermer la modale
const stopPropagation = function (e) {
    e.stopPropagation()
};

function resetmodaleSectionProjets() {
    modaleSectionProjets.innerHTML = "";
}

const modaleSectionProjets = document.querySelector(".js-modale-projets");

function modaleProjets() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            resetmodaleSectionProjets()
            for (let i = 0; i < data.length; i++) {

                const div = document.createElement("div");
                div.classList.add("gallery-projet-modale");
                modaleSectionProjets.appendChild(div);

                const img = document.createElement("img");
                img.src = data[i].imageUrl;
                img.alt = data[i].title;
                div.appendChild(img);

                const icon = document.createElement("i");
                icon.classList.add(data[i].id, "fa-solid", "fa-trash-can", "supprimer-projet");
                div.appendChild(icon);
            }
            listenerSupprimerProjet()
        })
}


function listenerSupprimerProjet() {
    document.querySelectorAll(".supprimer-projet").forEach(btnSupprimer => {
        btnSupprimer.addEventListener("click", supprimerProjet, false);

    });
}
async function supprimerProjet() {
    // Afficher une boîte de confirmation
    const confirmation = confirm("Voulez-vous supprimer le projet ?");
        if (confirmation) {
        await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            refreshPage(this.classList[0])
            alert("Projet supprimé");
        })
        .catch(error => {
        });
    }
    else {
        alert("Suppression annulée");
    }
}

// Rafraichit les projets sans recharger la page
async function refreshPage(i) {
    modaleProjets(); // Re lance une génération des projets dans la modale admin
    const projetAccueil = document.querySelector(`.js-projet-${i}`);
    projetAccueil.style.display = "none";
}




const boutonLogin = document.querySelector(".btn-login");

pageAdmin()

function pageAdmin() {
    document.querySelectorAll(".modif-login").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            boutonLogin.innerHTML = "logout";
            divFiltres.innerHTML = "";
        }
    });
}



///// modal 2
let modale2 = null

const openModale2 = function (e) {
    e.preventDefault()
    modale2 = document.querySelector(e.target.getAttribute("href"))

    modale2.style.display = null
    modale2.removeAttribute("aria-hidden")

    modaleProjets();

    // Appel fermeture modale ou retour
    modale2.addEventListener("click", closeModale2)
    modale2.querySelector(".js-modale-close").addEventListener("click", closeModale2)
    modale2.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
    modale2.querySelector(".js-modale-return").addEventListener("click", backToModale)
}

// Element qui ouvre la modale
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
})

// Fermeture de la modale
const closeModale2 = function (e) {
    if (modale === null) return


    modale2.style.display = "none"
    modale2.setAttribute("aria-hidden", "true")

    modale2.removeEventListener("click", closeModale)
    modale2.querySelector(".js-modale-close").removeEventListener("click", closeModale)
    modale2.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)
    modale2 = null

    closeModale(e)
    const fileInput = document.getElementById("photo");
    const miniature = document.getElementById("miniature");
    const effacerElements = document.querySelectorAll(".effacer-si-image");
    // vidage pour la prévisualisation 
    fileInput.value = "";
    miniature.src = "";
    effacerElements.forEach(element => element.style.display = "");
}

const backToModale = function (e) {
    e.preventDefault()
    modale2.style.display = "none"
};



// Fonction pour afficher la miniature
function showThumbnail() {
    const fileInput = document.getElementById("photo");
    const miniature = document.getElementById("miniature");
    const effacerElements = document.querySelectorAll(".effacer-si-image");

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            miniature.src = e.target.result;
            effacerElements.forEach(function (e) {
                e.style.display = "none";
            });
        };
        reader.readAsDataURL(file);
    }
}

// Écoute les changements dans le champ input file
const fileInput = document.getElementById("photo");
fileInput.addEventListener("change", showThumbnail);


/////////////////////////// gestion ajout de projets /////////////////////////////////
const btnValider = document.querySelector(".js-valider");
btnValider.addEventListener("click", ajoutProjet);

const inputTitre = document.querySelector(".js-titre")
const inputCategorie = document.querySelector(".js-categorie")
const inputImage = document.querySelector(".js-image")

inputTitre.addEventListener("input", couleuBtn)
inputCategorie.addEventListener("input", couleuBtn)
inputImage.addEventListener("change", couleuBtn)

function couleuBtn() {
    if (inputTitre.value !== "" && inputCategorie.value !== "" && inputImage.files.length > 0) {
        btnValider.style.backgroundColor = "#1D6154"
    }
}
/* function couleuBtn() {
    if (inputTitre.value !== "" && inputCategorie.value !== "" && inputImage.files.length > 0) {
        btnValider.classList.add("bouton-actif");
    } else {
        btnValider.classList.remove("bouton-actif");
    }
}
*/
async function ajoutProjet(event) {
    event.preventDefault();

    const titre = inputTitre.value
    const categorie = inputCategorie.value
    const image = inputImage.files[0]

    if (titre === "" || categorie === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categorie !== "1" && categorie !== "2" && categorie !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        const data = new FormData()
        data.append("title", titre)
        data.append("category", categorie)
        data.append("image", image)

        const reponse = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });

        if (reponse.status === 201) {
            modaleProjets()
            getProjets()
            backToModale(event)
        }
    }
}

