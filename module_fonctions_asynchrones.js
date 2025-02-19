/* Fonction permettant la récupération des données depuis l'API */
async function recuperer_liste_donnees(url, type) {
    let lien_next = url;
    let donnees_completes = [];
    let donnees_exploitables;

    if (type === "categories") {
        while (lien_next !== null) {
            let reponse = await fetch(lien_next);
            let donnees = await reponse.json();
            donnees_completes = donnees_completes.concat(donnees.results);
            lien_next = donnees.next;
        }
    } else if (type === "descriptions") {
        let reponse = await fetch(url);
        donnees_exploitables = await reponse.json();
    } else {
        while (lien_next !== null && donnees_completes.length < 8) {
            let reponse = await fetch(lien_next);
            let donnees = await reponse.json();
            donnees_completes = donnees_completes.concat(donnees.results);
            lien_next = donnees.next;
        }
    }

    if (type !== "descriptions") {
        donnees_exploitables = [];
        for (i = 0; i < donnees_completes.length; i++) {
            if (donnees_completes[i].id === 259534 || donnees_completes[i].id === 5575408) {
                continue;
            } else {
                donnees_exploitables.push(donnees_completes[i]);
            }
        }
    }
    return donnees_exploitables;
}

/* Récupérer tout les genres de films*/
async function recuperer_genre_films() {
    let categories = [];
    donnees_exploitables = await recuperer_liste_donnees("http://localhost:8000/api/v1/genres/", "categories");
    for (let i = 0; i < donnees_exploitables.length; i++) {
        categories.push(donnees_exploitables[i].name);
    }
    return categories;
}

async function recuperer_descriptions(url) {
    donnees_film = await recuperer_liste_donnees(url, "descriptions");
    return donnees_film;
}

/* Récupérer les données du meilleur film */
async function meilleur_film() {
    donnees_exploitables = await recuperer_liste_donnees(
        "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=9.2&imdb_score_max=&title=" +
            "&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=" +
            "&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
    );
    let ancien_film = donnees_exploitables[0];
    let infos_film = {};
    for (let i = 0; i < donnees_exploitables.length; i++) {
        if (donnees_exploitables[i].votes > ancien_film.votes && donnees_exploitables[i].imdb_score === donnees_exploitables[0].imdb_score) {
            ancien_film = donnees_exploitables[i];
        }
    }
    let film_meilleure_note = ancien_film;
    id_film = film_meilleure_note.id;
    url_film = "http://localhost:8000/api/v1/titles/" + id_film;

    donnees_film = await recuperer_descriptions(url_film, "descriptions");

    infos_film = recuperer_infos_film(
        ancien_film.year,
        ancien_film.genres,
        ancien_film.imdb_score,
        donnees_film.duration,
        donnees_film.countries,
        donnees_film.description,
        donnees_film.long_description
    );

    inserer_donnees(
        film_meilleure_note.image_url,
        film_meilleure_note.title,
        "image-meilleur-film",
        "titre-meilleur-film",
        "description-meilleur-film",
        "image-meilleur-film-modale",
        "titre-meilleur-film-modale",
        "description-meilleur-film-modale",
        film_meilleure_note.directors,
        infos_film,
        film_meilleure_note.actors,
        "realisateurs-meilleur-film-modale",
        "infos-meilleur-film-modale",
        "infos-2-meilleur-film-modale",
        "imdb-meilleur-film-modale",
        "acteurs-meilleur-film-modale"
    );
}

/* Récupérer les meilleurs films de chaque catégorie */
async function films_par_categorie() {
    let categories = ["Action", "Adventure", "Family"];
    inserer_noms_categories(categories);

    let infos_film = {};
    let count_cat1 = 1;
    let count_cat2 = 1;
    let count_cat3 = 1;

    for (let i = 0; i < 3; i++) {
        donnees_exploitables = await recuperer_liste_donnees(
            "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min" +
                "=8.7&imdb_score_max=&title=&title_contains=&genre=" +
                categories[i] +
                "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
                "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
        );

        for (let j = 0; j < donnees_exploitables.length; j++) {
            id_film = donnees_exploitables[j].id;
            url_film = "http://localhost:8000/api/v1/titles/" + id_film;

            donnees_film = await recuperer_descriptions(url_film, "descriptions");

            infos_film = recuperer_infos_film(
                donnees_exploitables[j].year,
                donnees_exploitables[j].genres,
                donnees_exploitables[j].imdb_score,
                donnees_film.duration,
                donnees_film.countries,
                donnees_film.description,
                donnees_film.long_description
            );

            let liste_genres_par_film = donnees_exploitables[j].genres;
            for (let k = 0; k < liste_genres_par_film.length; k++) {
                switch (liste_genres_par_film[k]) {
                    case "Action":
                        if (count_cat1 <= 6) {
                            let id_image = "img-" + count_cat1 + "-cat1";
                            let id_titre = "titre-" + count_cat1 + "-cat1";
                            let id_image_modale = "image-film-" + count_cat1 + "-modale-cat1";
                            let id_titre_modale = "titre-film-" + count_cat1 + "-modale-cat1";
                            let id_realisateurs_modale = "realisateurs-film-" + count_cat1 + "-modale-cat1";
                            let id_infos_modale = "infos-film-" + count_cat1 + "-modale-cat1";
                            let id2_infos_modale = "infos-2-film-" + count_cat1 + "-modale-cat1";
                            let id_imdb_modale = "imdb-film-" + count_cat1 + "-modale-cat1";
                            let id_description_modale = "description-film-" + count_cat1 + "-modale-cat1";
                            let id_acteurs_modale = "acteurs-film-" + count_cat1 + "-modale-cat1";

                            inserer_donnees(
                                donnees_exploitables[j].image_url,
                                donnees_exploitables[j].title,
                                id_image,
                                id_titre,
                                "",
                                id_image_modale,
                                id_titre_modale,
                                id_description_modale,
                                donnees_exploitables[j].directors,
                                infos_film,
                                donnees_exploitables[j].actors,
                                id_realisateurs_modale,
                                id_infos_modale,
                                id2_infos_modale,
                                id_imdb_modale,
                                id_acteurs_modale
                            );
                            count_cat1++;
                        }
                        break;

                    case "Adventure":
                        if (count_cat2 <= 6) {
                            id_image = "img-" + count_cat2 + "-cat2";
                            id_titre = "titre-" + count_cat2 + "-cat2";
                            id_image_modale = "image-film-" + count_cat2 + "-modale-cat2";
                            id_titre_modale = "titre-film-" + count_cat2 + "-modale-cat2";
                            id_realisateurs_modale = "realisateurs-film-" + count_cat2 + "-modale-cat2";
                            id_infos_modale = "infos-film-" + count_cat2 + "-modale-cat2";
                            id2_infos_modale = "infos-2-film-" + count_cat2 + "-modale-cat2";
                            id_imdb_modale = "imdb-film-" + count_cat2 + "-modale-cat2";
                            id_description_modale = "description-film-" + count_cat2 + "-modale-cat2";
                            id_acteurs_modale = "acteurs-film-" + count_cat2 + "-modale-cat2";

                            inserer_donnees(
                                donnees_exploitables[j].image_url,
                                donnees_exploitables[j].title,
                                id_image,
                                id_titre,
                                "",
                                id_image_modale,
                                id_titre_modale,
                                id_description_modale,
                                donnees_exploitables[j].directors,
                                infos_film,
                                donnees_exploitables[j].actors,
                                id_realisateurs_modale,
                                id_infos_modale,
                                id2_infos_modale,
                                id_imdb_modale,
                                id_acteurs_modale
                            );
                            count_cat2++;
                        }
                        break;

                    case "Family":
                        if (count_cat3 <= 6) {
                            id_image = "img-" + count_cat3 + "-cat3";
                            id_titre = "titre-" + count_cat3 + "-cat3";
                            id_image_modale = "image-film-" + count_cat3 + "-modale-cat3";
                            id_titre_modale = "titre-film-" + count_cat3 + "-modale-cat3";
                            id_realisateurs_modale = "realisateurs-film-" + count_cat3 + "-modale-cat3";
                            id_infos_modale = "infos-film-" + count_cat3 + "-modale-cat3";
                            id2_infos_modale = "infos-2-film-" + count_cat3 + "-modale-cat3";
                            id_imdb_modale = "imdb-film-" + count_cat3 + "-modale-cat3";
                            id_description_modale = "description-film-" + count_cat3 + "-modale-cat3";
                            id_acteurs_modale = "acteurs-film-" + count_cat3 + "-modale-cat3";

                            inserer_donnees(
                                donnees_exploitables[j].image_url,
                                donnees_exploitables[j].title,
                                id_image,
                                id_titre,
                                "",
                                id_image_modale,
                                id_titre_modale,
                                id_description_modale,
                                donnees_exploitables[j].directors,
                                infos_film,
                                donnees_exploitables[j].actors,
                                id_realisateurs_modale,
                                id_infos_modale,
                                id2_infos_modale,
                                id_imdb_modale,
                                id_acteurs_modale
                            );
                            count_cat3++;
                        }
                        break;
                }
            }
        }
    }
}

function inserer_noms_categories(categories) {
    let titre;
    for (let i = 1; i < 4; i++) {
        nouveau_titre = categories[i - 1];
        id_titre = "titre".concat(i.toString());
        titre = document.getElementById(id_titre);
        titre.textContent = nouveau_titre;
    }
}

async function entrer_donnees_fenetre_modale(realisateurs, infos, acteurs, id_realisateurs, id_infos, id2_infos, id_imdb, id_acteurs) {
    realisateurs_html = document.getElementById(id_realisateurs);
    infos_html = document.getElementById(id_infos);
    infos2_html = document.getElementById(id2_infos);
    imdb_html = document.getElementById(id_imdb);
    acteurs_html = document.getElementById(id_acteurs);

    let infos_realisateurs = "";
    for (let i = 0; i < realisateurs.length; i++) {
        if (i === realisateurs.length - 1) {
            infos_realisateurs += realisateurs[i];
        } else {
            infos_realisateurs += realisateurs[i] + ", ";
        }
    }

    let genres = "";
    for (let j = 0; j < infos["genres"].length; j++) {
        if (j < infos["genres"].length - 1) {
            genres = genres + infos["genres"][j] + ", ";
        } else {
            genres = genres + infos["genres"][j];
        }
    }

    let pays = "";
    for (let k = 0; k < infos["pays_film"].length; k++) {
        if (k < infos["pays_film"].length - 1) {
            pays = pays + infos["pays_film"][k] + " / ";
        } else {
            pays = pays + infos["pays_film"][k];
        }
    }

    realisateurs_html.textContent = infos_realisateurs;
    infos_html.textContent = `${infos["year"]} - ${genres}`;
    infos2_html.textContent = `${infos["duree_film"]} minutes (${pays})`;
    imdb_html.textContent = `IMDB score : ${infos["imdb_score"]}/10`;

    let liste_acteurs = "";
    for (let k = 0; k < acteurs.length; k++) {
        if (k + 1 === acteurs.length) {
            liste_acteurs += acteurs[k];
        } else {
            liste_acteurs += acteurs[k] + ", ";
        }
    }

    acteurs_html.textContent = liste_acteurs;
}

async function textes_menus() {
    menu = document.getElementById("options-menu");
    titre_menu = document.getElementById("categorie-menu");

    categories = await recuperer_genre_films();

    let liste_html = "";
    for (let i = 1; i <= categories.length; i++) {
        switch (categories[i - 1]) {
            case "Action":
            case "Adventure":
            case "Family":
                continue;
        }
        if (titre_menu.textContent === categories[i - 1]) {
            liste_html += '<li class="lien" onclick="selectionner_menu(event)">' + categories[i - 1] + '<img src="img/check.png" alt="menu actif"></li>';
        } else {
            liste_html += '<li class="lien" onclick="selectionner_menu(event)">' + categories[i - 1] + "</li>";
        }
    }
    menu.innerHTML = liste_html;
}

async function selectionner_menu(event) {
    chargement = document.getElementById("chargement");
    chargement.className = "chargement-affiche";

    element_selectionne = event.target;
    titre_menu = document.getElementById("categorie-menu");
    menu = document.getElementById("options-menu");
    balises_li = menu.querySelectorAll("li");
    for (let i = 0; i < balises_li.length; i++) {
        if (balises_li[i].querySelector("img") !== null) {
            balises_li[i].querySelector("img").remove();
        }
    }
    nouvelle_balise = document.createElement("img");
    nouvelle_balise.src = "img/check.png";
    nouvelle_balise.alt = "menu actif";
    element_selectionne.appendChild(nouvelle_balise);
    titre_menu.textContent = element_selectionne.textContent;
    afficher_masquer_menu();

    donnees_exploitables = await recuperer_liste_donnees(
        "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min" +
            "=8.7&imdb_score_max=&title=&title_contains=&genre=" +
            titre_menu.textContent +
            "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
            "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=",
        ""
    );

    let j = 8;
    while (donnees_exploitables.length < 6 && j > 0) {
        donnees_exploitables = await recuperer_liste_donnees(
            "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
                j +
                "&imdb_score_max=&title=&title_contains=&genre=" +
                titre_menu.textContent +
                "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
                "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=",
            ""
        );
        j--;
    }

    let liste_html = "";
    let index = 0;
    let count = 0;

    grille_films = document.getElementById("grille-elements-cat4");

    /* Le code HTML est injecté à la demande en fonction du nombre d'éléments de la catégorie sélectionnée */
    for (let k = 1; k <= donnees_exploitables.length; k++) {
        liste_html += '<div class="conteneur">';
        liste_html += '<img id="img-' + k + '-cat4" src="" alt="affiche du film ' + k + '">';
        liste_html += '<div class="overlay">';
        liste_html += '<p id="titre-' + k + '-cat4" class="titre-overlay"></p>';
        liste_html += '<p class="bouton" onclick="afficher_fenetre_modale_film(\'' + k + "', '4')\">Détails</p>";
        liste_html += "</div></div>";
        liste_html += '<div id="fenetre-modale-film-' + k + '-cat4" class="fenetre-modale-film-cachee">';
        liste_html += '<div class="grille-elements-film-modale">';
        liste_html += '<div  id="conteneur-image-modale-' + k + '-cat4" class="conteneur-image-film-modale">';
        liste_html += '<img id="image-film-' + k + '-modale-cat4" src="" alt="affiche du film">';
        liste_html += "</div>";
        liste_html += '<div class="conteneur-texte-film-modale">';
        liste_html += '<h1 id="titre-film-' + k + '-modale-cat4"></h1>';
        liste_html += '<p class="supprimer-margin-padding" id="infos-film-' + k + '-modale-cat4"></p>';
        liste_html += '<p class="supprimer-margin-padding" id="infos-2-film-' + k + '-modale-cat4"></p>';
        liste_html += '<p class="supprimer-margin-padding" id="imdb-film-' + k + '-modale-cat4"></p>';
        liste_html += '<p class="realisateur-film-modale"><span>Réalisé par:</span></br><span id="realisateurs-film-' + k + '-modale-cat4"></span></p>';
        liste_html += "</div></div>";
        liste_html += '<p id="description-film-' + k + '-modale-cat4" class="description-film-modale"></p>';
        liste_html += '<div id="nouveau-conteneur-image-modale-' + k + '-cat4"></div>';
        liste_html += '<div class="conteneur-liste-acteurs-modale">';
        liste_html += '<p class="avec">Avec :</p>';
        liste_html += '<p id="acteurs-film-' + k + '-modale-cat4"></p>';
        liste_html += "</div>";
        liste_html += '<div class="conteneur-bouton-modale">';
        liste_html += '<p class="bouton-film-modale" onclick="fermer_fenetre_modale_film(\'' + k + "', '4')\">Fermer</p>";
        liste_html += "</div></div>";

        count++;
        if (k === 6) {
            break;
        }
    }

    grille_films.innerHTML = liste_html;

    let infos_film = {};

    for (x = 0; x < count; x++) {
        id_film = donnees_exploitables[x].id;
        url_film = "http://localhost:8000/api/v1/titles/" + id_film;

        donnees_film = await recuperer_descriptions(url_film, "descriptions");

        infos_film = {};
        if (x !== count) {
            index = x + 1;
        } else {
            index = x;
        }

        infos_film = recuperer_infos_film(
            donnees_exploitables[x].year,
            donnees_exploitables[x].genres,
            donnees_exploitables[x].imdb_score,
            donnees_film.duration,
            donnees_film.countries,
            "",
            donnees_film.long_description
        );

        id_image = "img-" + index + "-cat4";
        id_titre = "titre-" + index + "-cat4";

        let url_image = donnees_exploitables[x].image_url;

        reponse = await fetch(url_image);
        if (reponse.status === 404) {
            url_image = "img/image_generique.jpg";
        }

        inserer_donnees(
            url_image,
            donnees_exploitables[x].title,
            id_image,
            id_titre,
            "",
            "image-film-" + index + "-modale-cat4",
            "titre-film-" + index + "-modale-cat4",
            "description-film-" + index + "-modale-cat4",
            donnees_exploitables[x].directors,
            infos_film,
            donnees_exploitables[x].actors,
            "realisateurs-film-" + index + "-modale-cat4",
            "infos-film-" + index + "-modale-cat4",
            "infos-2-film-" + index + "-modale-cat4",
            "imdb-film-" + index + "-modale-cat4",
            "acteurs-film-" + index + "-modale-cat4"
        );

        chargement.className = "chargement-cache";
    }

    bouton_voir_plus = document.getElementById("conteneur-voir-plus-cat4");

    if (screen.width < 767) {
        if (donnees_exploitables.length > 2) {
            bouton_voir_plus.style.display = "flex";
        }
    } else if (screen.width >= 767 && screen.width < 991) {
        if (donnees_exploitables.length > 4) {
            bouton_voir_plus = document.getElementById("conteneur-voir-plus-cat4");
            bouton_voir_plus.style.display = "flex";
        }
    } else {
        bouton_voir_plus.style.display = "none";
    }

    let nombre_elements = 0;
    if (donnees_exploitables.length > 6) {
        nombre_elements = 6;
    } else {
        nombre_elements = donnees_exploitables.length;
    }

    parametrage_mobile("cat4", nombre_elements);
}
