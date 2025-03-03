
let movies = [[], [], [], [], []];

/* Récupérer et insérer les données du meilleur film */
async function best_movie() {
    data = await fetch_data(
        "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=9.2&imdb_score_max=&title=" +
            "&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=" +
            "&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", "best_movie"
    );

    let best_movie = data[0];
    id_movie = best_movie.id;

    best_movie_url = "http://localhost:8000/api/v1/titles/" + id_movie;
    movie_data = await fetch_data(best_movie_url, "movie");

    movies[0].push(id_movie)

    insert_data(movie_data, "best-movie-image", "best-movie-title", "best-movie-description");
    insert_data_modal(movie_data, "modal-image", "modal-title", "modal-infos", "modal-infos-line2", "modal-imdb", "modal-director", "modal-actors", "modal-description")
}

/* Fonction permettant la récupération des données depuis l'API */
async function fetch_data(url, type) {
    let data = [];

    let response = await fetch(url);
    let data_json = await response.json();
    
    if (type === "movie"){
            return data_json;
    }

    if (type === "best_movie") {
        data = data.concat(data_json.results);
        return data;
    }

    data = data.concat(data_json.results);
    let next_link = data_json.next;

    while (next_link !== null) {
        response = await fetch(next_link);
        data_json = await response.json();
        next_link = data_json.next;
        if (type === "categories"){
            data = data.concat(data_json.results);
            continue;
        } else {
            for (i = 0 ; data.length < 6; i++) {
                data = data.concat(data_json.results[i]);
            }
            next_link = null;
        }
    }
    return data;
}

/* Récupérer tout les genres de films*/
async function fetch_movie_categories() {
    let categories = [];
    data = await fetch_data("http://localhost:8000/api/v1/genres/", "categories");
    for (let i = 0; i < data.length; i++) {
        categories.push(data[i].name);
    }
    return categories;
}

/* Récupérer les meilleurs films de chaque catégorie */
async function insert_movies_into_categories() {

    for (let i = 0; i < 3; i++) {
        let categorie_number = i + 1;
        data = await fetch_data(
            "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min" +
                "=8.7&imdb_score_max=&title=&title_contains=&genre=" +
                selected_categories[i] +
                "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
                "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
        );

        
        for (j = 0; j < data.length; j++) {
            index = j + 1
            let id_image = "img-" + index + "-cat" + categorie_number;
            let id_title = "title-" + index + "-cat" + categorie_number;

            insert_data(data[j], id_image, id_title, "");
            movies[categorie_number].push(data[j].id)
        }
    }
}
async function menu_titles() {
    menu = document.getElementById("options-menu");
    menu_title = document.getElementById("category-menu");

    categories = await fetch_movie_categories();

    let html_adding = "";
    for (let i = 1; i <= categories.length; i++) {
        switch (categories[i - 1]) {
            case "Action":
            case "Adventure":
            case "Family":
                continue;
        }
        if (menu_title.textContent === categories[i - 1]) {
            html_adding += '<li class="link" onclick="see_selected_categorie(event)">' + categories[i - 1] + '<img src="img/check.png" alt="menu actif"></li>';
        } else {
            html_adding += '<li class="link" onclick="see_selected_categorie(event)">' + categories[i - 1] + "</li>";
        }
    }
    menu.innerHTML = html_adding;
}

async function see_selected_categorie(event) {

    let loading = document.getElementById("loading");
    loading.className = "see-loading";
    
    reset_conteners()
    change_checkmark_position(event)
    menu_title = change_menu_title(event)
    change_display_menu();

    data = await fetch_data(
        "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min" +
            "=8.7&imdb_score_max=&title=&title_contains=&genre=" +
            menu_title.textContent +
            "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
            "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=",
        ""
    );

    let j = 5;
    while (data.length < 6 && j > 0) {
        data = await fetch_data(
            "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=" +
                j +
                "&imdb_score_max=&title=&title_contains=&genre=" +
                menu_title.textContent +
                "&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&" +
                "actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=",
            ""
        );
        j--;
    }

    see_conteners(data.length)

    movies[4].length = 0
    for (x = 0; x < data.length; x++) {
        id_movie = data[x].id;

        let index = x + 1;
        id_image = "img-" + index + "-cat4";
        id_title = "title-" + index + "-cat4";

        movies[4].push(data[x].id)
        insert_data(data[x], id_image, id_title, "");
    }

    loading.className = "hide-loading";

    button_more = document.getElementById("contener-see-more-cat4");
        if (data.length > 2 && screen.width <= 767) {
            button_more.className = "contener-see-more"
        } else if (data.length > 4 && screen.width > 767 && screen.width < 991) {
            button_more.className = "contener-see-more"
        } else {
        button_more.className = "contener-see-more-cache"
    }
}
