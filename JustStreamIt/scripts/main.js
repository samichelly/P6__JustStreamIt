const API_URL = 'http://localhost:8000/api/v1/titles/';
const LIMIT_MOVIES_ByCATEGORY = 7;
const LIMIT_BEST_MOVIES = 8;
const MOVIES_BY_API_PAGE = 5;
const CLASS_CATEGORIE = 'categorie';
const CLASS_BTN = 'btn';

function main_movie(best_Movie) {
    document.getElementById('best_movie_title').innerHTML =
        `${best_Movie.title} (${best_Movie.year})`;
    const bestButtonDetails = document.getElementById('btn_best_movie_details');
    bestButtonDetails.addEventListener('click', () => showMoviePopup(best_Movie.id));

    const bestMovieImage = document.getElementById('best_movie_image').querySelector('img');
    bestMovieImage.src = best_Movie.image_url;
}


async function movies_by_category(genre, limit = LIMIT_MOVIES_ByCATEGORY) {
    const pagesToFetch = Math.ceil(limit / MOVIES_BY_API_PAGE);
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
    const query_parameters = `?genre=${genre}&sort_by=-imdb_score&page=${page}`;
    const url_category = API_URL + query_parameters;
    const response = await fetch(url_category);
    const data = await response.json();
    return data.results;
}

async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(API_URL + movieId);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
        throw error;
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

function createSection(className, genre = null) {
    const section = document.createElement('section');
    section.classList.add(className);
    if (genre) {
        section.classList.add(genre);
    }
    return section;
}

function createHeading(textContent) {
    const h1 = document.createElement('h1');
    h1.textContent = textContent;
    return h1;
}



function createCarrousel(movies, genre) {
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('swiper-slide');
        movieCard.innerHTML = `
          <h3>${movie.title}</h3>
          <div class="movie-image">
                <img src="${movie.image_url}" alt="${movie.title}" />
                <button class="${CLASS_BTN}" data-movie-id="${movie.id}">More details</button>
            </div>`;
        swiperWrapper.appendChild(movieCard);
    });

    const carrouselContainer = document.createElement('div');
    carrouselContainer.classList.add('swiper-container');
    carrouselContainer.appendChild(swiperWrapper);

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next');
    nextButton.classList.add(`swiper-button-${genre}`); // Ajout de la classe spécifique au genre
    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');
    prevButton.classList.add(`swiper-button-${genre}`); // Ajout de la classe spécifique au genre

    carrouselContainer.appendChild(nextButton);
    carrouselContainer.appendChild(prevButton);

    if (genre !== null) {
        document.querySelector(`.${CLASS_CATEGORIE}.${genre}`).appendChild(carrouselContainer);
    } else {
        const sectionBestMovies = document.querySelector(`.${CLASS_CATEGORIE}`);
        sectionBestMovies.appendChild(carrouselContainer);
    }

    new Swiper(carrouselContainer, {
        slidesPerView: 4,
        spaceBetween: 10,
        loop: false,
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

    const buttonsSelector = genre !== null ? `.${CLASS_CATEGORIE}.${genre} .${CLASS_BTN}` : `.${CLASS_BTN}`;
    const buttons = document.querySelectorAll(buttonsSelector);

    buttons.forEach(button => {
        button.addEventListener('click', () => showMoviePopup(button.dataset.movieId));
    });
}


async function main() {
    try {
        const bestMovies = await movies_by_category("", LIMIT_BEST_MOVIES);
        const topMovie = bestMovies[0];
        main_movie(topMovie);

        const otherBestMovies = bestMovies.slice(1, 8);
        const sectionBestMovies = createSection(CLASS_CATEGORIE);
        const h1BestMovies = createHeading("Films les mieux notés");
        sectionBestMovies.appendChild(h1BestMovies);
        document.querySelector('main').appendChild(sectionBestMovies);
        createCarrousel(otherBestMovies, null);

        const genres = ["Adventure", "Drama", "Fantasy"];
        for (const genre of genres) {
            const movies = await movies_by_category(genre, LIMIT_MOVIES_ByCATEGORY);
            const section = createSection(CLASS_CATEGORIE, genre);
            const h1 = createHeading(genre);
            section.appendChild(h1);
            document.querySelector('main').appendChild(section);
            createCarrousel(movies, genre);
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution du script principal :", error);
    }
}

main();
