const body = document.body;

function insert_category_titles(categories) {
    let title;
    for (let i = 1; i < 4; i++) {
        let new_title = categories[i - 1];
        let id_title = "title".concat(i.toString());
        title = document.getElementById(id_title);
        title.textContent = new_title;
    }
}

function insert_data(movie, id_image, id_title, id_description) {

    let image = document.getElementById(id_image);
    let title = document.getElementById(id_title);

    title.textContent = movie.title;
    image.setAttribute("src", movie.image_url);
    image.onerror = function() {
        image.src = "img/image_generique.jpg"
      };

    if (id_description !== "") {
        let description_tag = document.getElementById(id_description);
        description_tag.textContent = movie.description;
    }
}

function insert_data_modal(movie, id_image, id_title, id_infos, id_infos_2, id_imdb, id_directors, id_actors, id_long_description){
    
    let title = document.getElementById(id_title);
    let image = document.getElementById(id_image);
    let directors_tag = document.getElementById(id_directors);
    let infos_tag = document.getElementById(id_infos);
    let infos2_tag = document.getElementById(id_infos_2);
    let imdb_tag = document.getElementById(id_imdb);
    let actors_tag = document.getElementById(id_actors);
    let description = document.getElementById(id_long_description);

    let infos_directors = "";
    for (let i = 0; i < movie.directors.length; i++) {
        if (i === movie.directors.length - 1) {
            infos_directors += movie.directors[i];
        } else {
            infos_directors += movie.directors[i] + ", ";
        }
    }

    let genres = "";
    for (let j = 0; j < movie.genres.length; j++) {
        if (j < movie.genres.length - 1) {
            genres = genres + movie.genres[j] + ", ";
        } else {
            genres = genres + movie.genres[j];
        }
    }

    let country = "";
    for (let k = 0; k < movie.countries.length; k++) {
        if (k < movie.countries.length - 1) {
            country = country + movie.countries[k] + " / ";
        } else {
            country = country + movie.countries[k];
        }
    }

    let actors = "";
    for (let x = 0; x < movie.actors.length; x++) {
        if (x + 1 === movie.actors.length) {
            actors += movie.actors[x];
        } else {
            actors += movie.actors[x] + ", ";
        }
    }

    title.textContent = movie.original_title;
    image.src = movie.image_url;
    image.onerror = function() {
        image.src = "img/image_generique.jpg"
      };
    directors_tag.textContent = infos_directors;
    infos_tag.textContent = `${movie.year} - ${genres}`;
    infos2_tag.textContent = `${movie.duration} minutes (${country})`;
    imdb_tag.textContent = `IMDB score : ${movie.imdb_score}/10`;
    actors_tag.textContent = actors;
    description.textContent = movie.long_description;
}

async function open_modal_window(category, movie_index) {

    if (screen.width <= 1200) {
        close_button = document.getElementById("close-logo");
        close_button.className = "see-close-logo"

        contener_image = document.getElementById("contener-modal-image")
        new_parent = document.getElementById("new-contener-modal-image");
        new_parent.appendChild(contener_image);
    }

    id_movie = movies[category][movie_index]
    movie_url = "http://localhost:8000/api/v1/titles/" + id_movie;
    movie_data = await fetch_data(movie_url, "movie");

    insert_data_modal(movie_data, "modal-image", "modal-title", "modal-infos", "modal-infos-line2", "modal-imdb", "modal-director", "modal-actors", "modal-description")
    
    modal_window = document.getElementById("modal-window");
    modal_window.className = "see-modal-window";
    modal_window.scrollTop = 0;
    body.style.overflow = "hidden";
}

function close_modal_window() {
    modal_window = document.getElementById("modal-window");
    modal_window.className = "hidden-modal-window";
    body.style.overflow = "visible";
}

function change_display_menu() {
    menu = document.getElementById("options-menu");
    button = document.getElementById("button-menu");
    switch (menu.className) {
        case "hidden-menu":
            menu.className = "see-menu";
            button.style.outlineStyle = "none";
            break;

        case "see-menu":
            menu.className = "hidden-menu";
            button.style.outlineStyle = "solid";
            break;
    }
}

function reset_conteners() {
    for (let i = 1; i <= 6; i++) {
        let image = document.getElementById("img-" + i + "-cat4");
        let title = document.getElementById("title-" + i + "-cat4");
        let contener = document.getElementById("contener-" + i + "-cat4")
        
        title.textContent = "";
        image.src = "img/image_generique.jpg";
        contener.className = "hidden-contener"
    }
}

function see_conteners(length_data) {
    for (let i = 1; i <= length_data; i++) {
        let contener = document.getElementById("contener-" + i + "-cat4")
        contener.className = "contener"
    }
}

function see_more_less(categorie) {
    button = document.getElementById("button-see-more-" + categorie);
    grid = document.getElementById("element-grid-" + categorie);

    if (grid.className === "element-grid develop") {
        grid.className = "element-grid";
        button.scrollIntoView({ behavior: "auto" });
        button.textContent = "More";
    } else {
        grid.className = "element-grid develop";
        button.textContent = "Less";
    }
}

function change_checkmark_position(event) {
    selected_element = event.target;
    menu = document.getElementById("options-menu");
    li_tag = menu.querySelectorAll("li");
    for (let i = 0; i < li_tag.length; i++) {
        if (li_tag[i].querySelector("img") !== null) {
            li_tag[i].querySelector("img").remove();
        }
    }
    new_tag = document.createElement("img");
    new_tag.src = "img/check.png";
    new_tag.alt = "menu actif";
    selected_element.appendChild(new_tag);
}

function change_menu_title(event) {
    selected_element = event.target;
    menu_title = document.getElementById("category-menu");
    menu_title.textContent = selected_element.textContent;
    return menu_title
}
