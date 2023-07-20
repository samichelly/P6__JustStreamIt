const url = 'http://localhost:8000/api/v1/titles/';

// récupérer data best_movie
function get_main_movie(imdb_sorting = "-imdb_score", limit = 1) {
    fetch(url + "?sort_by=" + imdb_sorting + "&limit=" + limit)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Echec : ' + response.status);
            }
        })
        .then(function (data) {
            let bestMovie = data.results[0]
            document.getElementById('best_movie').innerHTML = 
            `<h2>${bestMovie.title} (${bestMovie.year})</h2>
            <img src=  ${bestMovie.image_url}>`;
            const bestButton = document.getElementById('btn_best_movie');
            bestButton.addEventListener('click', () => showMoviePopup(bestMovie.id));
        })
        .catch(function (error) {
            console.log(error);
        });
}



async function movies_by_category(genre, limit = 7) {
    const movies = await fetchMoviesByPage(genre, 1);
    const moviesPage2 = await fetchMoviesByPage(genre, 2);
    const allMovies = movies.concat(moviesPage2);
    if (allMovies.length > limit) {
        allMovies.splice(limit);
    }
    return allMovies;
}

async function fetchMoviesByPage(genre, page) {
    const query_parameters = `?genre=${genre}&page=${page}`;
    const url_category = url + query_parameters;
    const response = await fetch(url_category);
    const data = await response.json();
    const movies = data.results;
    return movies;
}


function carrousel(movies, genre) {
    const swiperWrapper = document.querySelector(`.categorie .swiper-wrapper`);

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('swiper-slide');
        movieCard.innerHTML = `
          <h2>${movie.title}</h2>
          <img src="${movie.image_url}" alt="${movie.title}" />
          <button class="btn" data-movie-id="${movie.id}">More details</button>`;
        swiperWrapper.appendChild(movieCard);
    });

    // Initialiser le carrousel avec Swiper
    new Swiper('.swiper-container', {
        slidesPerView: 4,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 4,
            },
        },
    });
    document.createElement('h2').innerHTML = genre;
    const buttons = document.querySelectorAll(`.categorie .btn`);
    buttons.forEach(button => {
        button.addEventListener('click', () => showMoviePopup(button.dataset.movieId));
    });
}


// Fonction pour créer et afficher la popup
function showMoviePopup(movieId) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const popupContent = document.createElement('div');
    popupContent.id = 'popup-content';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-popup-button';
    closeButton.textContent = 'Fermer';

    // Récupérer les détails du film depuis l'API
    fetch(url + movieId)
        .then(response => response.json())
        .then(data => {
            popupContent.innerHTML = `
                <h2>${data.title} (${data.year})</h2>
                <img src= ${data.image_url}>
                <p><strong>Genres:</strong> ${data.genres.join(', ')}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>IMDb Score:</strong> ${data.imdb_score}</p>
                <p><strong>Actors:</strong> ${data.actors.join(', ')}</p>
                <p><strong>Directors:</strong> ${data.directors.join(', ')}</p>
                <p><strong>Writers:</strong> ${data.writers.join(', ')}</p>
                <p><strong>Countries:</strong> ${data.countries.join(', ')}</p>
                <p><strong>Languages:</strong> ${data.languages.join(', ')}</p>
            `;

            // Ajouter les éléments au DOM
            popup.appendChild(popupContent);
            popup.appendChild(closeButton);
            document.body.appendChild(popup);

            // Gérer l'événement du bouton "Fermer"
            closeButton.addEventListener('click', () => {
                popup.remove();
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails du film :", error);
        });
}

async function main() {
    try {
        const mainMovies = get_main_movie();
        const genres = ["Adventure"];//, "Drama", "Fantasy"];
        for (const genre of genres) {
            const movies = await movies_by_category(genre);
            carrousel(movies, genre);
            console.log(genre);
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution du script principal :", error);
    }
}

main();
