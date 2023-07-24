const url = 'http://localhost:8000/api/v1/titles/';


// séparer l'obtention du dictionnaire et la l'affichage à partir du bouton
// Récupérer data best_movie
function get_main_movie(imdb_sorting = "-imdb_score") {
    fetch(url + "?sort_by=" + imdb_sorting)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error("Page non atteinte, Erreur :", response.status);
            }
        })
        .then(function (data) {
            let bestMovie = data.results[0]
            document.getElementById('best_movie').innerHTML =
                `<h2>${bestMovie.title} (${bestMovie.year})</h2>
            <img src=  ${bestMovie.image_url}>`;
            const bestButton = document.getElementById('btn_best_movie');
            bestButton.addEventListener('click', () => showMoviePopup(bestMovie.id));
            console.log("test")
            console.log(data.results.slice(1, 8))
            // return data.results.slice(1, 3)
            
            // Récupérer les data.results[1:8] pour gérer la partie Meilleurs Films
        })
        .catch(function (error) {
            console.log(error);
        });
}


// ajouter l'argument les meilleurs films
// genre facultatif
// evolution possible, penser avec une fonction pour définir les paramèters et arguments
async function movies_by_category(genre, limit = 7) {
    const pagesToFetch = Math.ceil(limit / 5);
    const allMovies = [];
    for (let page = 1; page <= pagesToFetch; page++) {
        const moviesPage = await fetchMoviesByPage(genre, page);
        allMovies.push(...moviesPage);
    }
    if (allMovies.length > limit) {
        allMovies.splice(limit);
    }
    return allMovies;
}


async function fetchMoviesByPage(genre, page) {
    console.log("hhhhh")
    const query_parameters = `?genre=${genre}&sort_by=-imdb_score&page=${page}`;
    console.log("qqqqqq")
    const url_category = url + query_parameters;
    const response = await fetch(url_category);
    const data = await response.json();
    return data.results;
}



// POPUP //
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(url + movieId);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
    }
}

function showMoviePopup(movieId) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const popupContent = document.createElement('div');
    popupContent.id = 'popup-content';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-popup-button';
    closeButton.textContent = 'Fermer';

    fetchMovieDetails(movieId)
        .then(data => {
            popupContent.innerHTML = `
                <h2>${data.title} (${data.year})</h2>
                <img src="${data.image_url}" alt="${data.title}" />
                <p><strong>Genres:</strong> ${data.genres.join(', ')}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>IMDb Score:</strong> ${data.imdb_score}</p>
                <p><strong>Actors:</strong> ${data.actors.join(', ')}</p>
                <p><strong>Directors:</strong> ${data.directors.join(', ')}</p>
                <p><strong>Writers:</strong> ${data.writers.join(', ')}</p>
                <p><strong>Countries:</strong> ${data.countries.join(', ')}</p>
                <p><strong>Languages:</strong> ${data.languages.join(', ')}</p>
            `;
            popup.appendChild(popupContent);
            popup.appendChild(closeButton);
            document.body.appendChild(popup);

            closeButton.addEventListener('click', () => {
                popup.remove();
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails du film :", error);
        });
}


// CAROUSSEL //
function carrousel(movies, genre) {
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('swiper-slide');
        movieCard.innerHTML = `
          <h2>${movie.title}</h2>
          <img src="${movie.image_url}" alt="${movie.title}" />
          <button class="btn" data-movie-id="${movie.id}">More details</button>`;
        swiperWrapper.appendChild(movieCard);
    });

    const carrouselContainer = document.createElement('div');
    carrouselContainer.classList.add('swiper-container');
    carrouselContainer.appendChild(swiperWrapper);

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next');
    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');

    carrouselContainer.appendChild(nextButton);
    carrouselContainer.appendChild(prevButton);

    document.querySelector(`.categorie.${genre}`).appendChild(carrouselContainer);

    // Initialiser le carrousel avec Swiper
    new Swiper(carrouselContainer, {
        slidesPerView: 4,
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: nextButton,
            prevEl: prevButton,
        },
        breakpoints: {
            768: {
                slidesPerView: 4,
            },
        },
    });

    const buttons = document.querySelectorAll(`.categorie.${genre} .btn`);
    buttons.forEach(button => {
        button.addEventListener('click', () => showMoviePopup(button.dataset.movieId));
    });
}

async function main() {
    try {
        const mainMovies = get_main_movie();
        const genres = ["Adventure", "Drama", "Fantasy"];
        for (const genre of genres) {
            const movies = await movies_by_category(genre);
            const section = document.createElement('section');
            section.classList.add('categorie', genre);
            const h1 = document.createElement('h1');
            h1.textContent = genre;
            section.appendChild(h1);
            document.querySelector('main').appendChild(section);
            carrousel(movies, genre);
            console.log(genre);
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution du script principal :", error);
    }
}

main();
