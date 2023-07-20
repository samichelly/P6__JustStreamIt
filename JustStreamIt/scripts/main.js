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
            document.getElementById('title_best_movie').innerHTML = 'title : ' + bestMovie.title;
            document.getElementById('description_best_movie').innerHTML = 'description : ' + bestMovie.description;
            document.getElementById('image_best_movie').innerHTML = '<img src="' + bestMovie.image_url + '">';
            const bestButton = document.getElementById('btn');
            bestButton.addEventListener('click', () => showMoviePopup(bestMovie.id));

            // document.getElementById(genre).innerHTML = genre;
            const buttons = document.querySelectorAll(`.categorie .btn`);
            buttons.forEach(button => {
                button.addEventListener('click', () => showMoviePopup(button.dataset.movieId));
            });

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

function openPopup() {
    // const popup = document.getElementById('my-popup');
    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('my-popup');
    popup.style.display = 'none';
}


async function showMoviePopup(movieId) {
    try {
        const response = await fetch(url + movieId);
        const data = await response.json();
        console.log(data)

        // Afficher la pop-up
        const popup = document.createElement('my-popup');
        popup.style.display = 'block';
        const popupContent = document.createElement('popup-content');
        popupContent.innerHTML = `
        <h2>${data.title} (${data.year})</h2>
        <p><strong>Genres:</strong> ${data.genres.join(', ')}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>IMDb Score:</strong> ${data.imdb_score}</p>
        <p><strong>Actors:</strong> ${data.actors.join(', ')}</p>
        <p><strong>Directors:</strong> ${data.directors.join(', ')}</p>
        <p><strong>Writers:</strong> ${data.writers.join(', ')}</p>
        <p><strong>Countries:</strong> ${data.countries.join(', ')}</p>
        <p><strong>Languages:</strong> ${data.languages.join(', ')}</p>
        <img src= ${data.image_url}>
    `;
        popup.appendChild(popupContent);

        document.body.appendChild(popup);
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
    }
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

// const closePopupButton = document.getElementById('close-popup-button');
// closePopupButton.addEventListener('click', closePopup);
