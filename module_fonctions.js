const body = document.body;

function parametrage_mobile(categorie, nb_elements) {
    if (screen.width < 767) {
        bandeau = document.getElementById("bandeau-superieur");
        bandeau.src = "img/bandeau_mobile.png";
    }

    if (screen.width < 1200) {
        let conteneur_image_modale;
        let no_categorie = "";

        if (categorie === "cat4") {
            no_categorie = "-cat4";
            onclick_categorie = "4";
        }

        for (let i = 1; i <= 3; i++) {
            if (i === 1 && categorie !== "cat4") {
                no_categorie = "-cat1";
                onclick_categorie = "1";
                nb_elements = 6;
            } else if (i === 2 && categorie !== "cat4") {
                no_categorie = "-cat2";
                onclick_categorie = "2";
                nb_elements = 6;
            } else if (i === 3 && categorie !== "cat4") {
                no_categorie = "-cat3";
                onclick_categorie = "3";
                nb_elements = 6;
            }

            if (categorie === "cat4") {
                i = 3;
            }

            if (i === 1) {
                nouvel_element = document.createElement("img");
                nouvel_element.className = "croix-fermeture-modale";
                nouvel_element.src = "img/croix.png";
                nouvel_element.alt = "croix fermeture fenêtre";
                conteneur_image_modale = document.getElementById("conteneur-image-modale-meilleur-film");
                nouveau_parent_conteneur = document.getElementById("nouveau-conteneur-image-modale-meilleur-film");
                nouveau_parent_conteneur.appendChild(conteneur_image_modale);

                fenetre_modale = document.getElementById("fenetre-modale-meilleur-film");
                nouvel_element.setAttribute("onclick", "fermer_fenetre_modale_meilleur_film()");
                fenetre_modale.appendChild(nouvel_element);
            }

            for (let j = 1; j <= nb_elements; j++) {
                nouvel_element = document.createElement("img");
                nouvel_element.className = "croix-fermeture-modale";
                nouvel_element.src = "img/croix.png";
                nouvel_element.alt = "croix fermeture fenêtre";
                conteneur_image_modale = document.getElementById("conteneur-image-modale-" + j + no_categorie);
                nouveau_parent_conteneur = document.getElementById("nouveau-conteneur-image-modale-" + j + no_categorie);
                nouveau_parent_conteneur.appendChild(conteneur_image_modale);

                fenetre_modale = document.getElementById("fenetre-modale-film-" + j + no_categorie);
                nouvel_element.setAttribute("onclick", "fermer_fenetre_modale_film(" + j + ", " + onclick_categorie + ")");
                fenetre_modale.appendChild(nouvel_element);
            }
        }
    }
}

function inserer_donnees(
    image_url,
    titre,
    id_image,
    id_titre,
    id_description,
    id_image_modale,
    id_titre_modale,
    id_description_modale,
    realisateurs,
    infos,
    acteurs,
    id_realisateurs,
    id_infos,
    id2_infos,
    id_imdb,
    id_acteurs
) {
    description = infos_film["description"];
    description_longue = infos_film["description_longue"];
    entrer_donnees_categories(image_url, titre, description, id_image, id_titre, id_description);
    entrer_donnees_categories(image_url, titre, description_longue, id_image_modale, id_titre_modale, id_description_modale);
    entrer_donnees_fenetre_modale(realisateurs, infos, acteurs, id_realisateurs, id_infos, id2_infos, id_imdb, id_acteurs);
}

function recuperer_infos_film(annee, genre, imdb, duree_film, pays_film, description, description_longue) {
    infos_film = {};
    infos_film["year"] = annee;
    infos_film["genres"] = genre;
    infos_film["imdb_score"] = imdb;
    infos_film["duree_film"] = duree_film;
    infos_film["pays_film"] = pays_film;
    infos_film["description"] = description;
    infos_film["description_longue"] = description_longue;

    return infos_film;
}

function entrer_donnees_categories(image_url, titre, decription, id_image, id_titre, id_description) {
    image = document.getElementById(id_image);
    titre_actuel = document.getElementById(id_titre);

    titre_actuel.textContent = titre;
    image.setAttribute("src", image_url);

    if (id_description !== "") {
        description_actuelle = document.getElementById(id_description);
        description_actuelle.textContent = decription;
    }
}

function afficher_fenetre_modale_meilleur_film() {
    fenetre_modale = document.getElementById("fenetre-modale-meilleur-film");
    fenetre_modale.className = "fenetre-modale-film-affichee";
    fenetre_modale.scrollTop = 0;
    body.style.overflow = "hidden";
}

function fermer_fenetre_modale_meilleur_film() {
    fenetre_modale = document.getElementById("fenetre-modale-meilleur-film");
    fenetre_modale.className = "fenetre-modale-film-cachee";
    body.style.overflow = "visible";
}

function afficher_fenetre_modale_film(id_fenetre, categorie) {
    fenetre_modale = document.getElementById("fenetre-modale-film-" + id_fenetre + "-cat" + categorie);
    fenetre_modale.className = "fenetre-modale-film-affichee";
    fenetre_modale.scrollTop = 0;
    body.style.overflow = "hidden";
}

function fermer_fenetre_modale_film(id_fenetre, categorie) {
    fenetre_modale = document.getElementById("fenetre-modale-film-" + id_fenetre + "-cat" + categorie);
    fenetre_modale.className = "fenetre-modale-film-cachee";
    body.style.overflow = "visible";
}

function afficher_masquer_menu() {
    menu = document.getElementById("options-menu");
    bouton_menu = document.getElementById("bouton-menu");
    switch (menu.className) {
        case "menu-liste-cache":
            menu.className = "menu-liste-affiche";
            bouton_menu.style.outlineStyle = "none";
            break;

        case "menu-liste-affiche":
            menu.className = "menu-liste-cache";
            bouton_menu.style.outlineStyle = "solid";
            break;
    }
}

function masquer_menu() {
    menu = document.getElementById("options-menu");
    if (menu.className === "menu-liste-affiche") {
        menu.className = "menu-liste-cache";
    }
}

function voir_plus_moins(categorie) {
    bouton = document.getElementById("bouton-voir-plus-" + categorie);
    grille_elements = document.getElementById("grille-elements-" + categorie);

    if (grille_elements.style.maxHeight === "200em") {
        if (screen.width < 768) {
            grille_elements.style.maxHeight = "40em";
        } else {
            grille_elements.style.maxHeight = "50em";
        }
        bouton.textContent = "Voir plus";
        if (screen.width <= 768) {
            bouton.scrollIntoView({ behavior: "auto" });
        }
    } else {
        grille_elements.style.maxHeight = "200em";
        bouton.textContent = "Voir moins";
    }
}
