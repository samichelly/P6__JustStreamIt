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
            document.getElementById('id_best_movie').innerHTML = 'id : ' + bestMovie.id;
            document.getElementById('imdb_best_movie').innerHTML = 'IMDB Score : ' + bestMovie.imdb_score;
            document.getElementById('image_best_movie').innerHTML = '<img src="' + bestMovie.image_url + '">';
            const bestButton = document.getElementById('best-button');
            bestButton.addEventListener('click', () => showMoviePopup(bestMovie.id));
        })
        .catch(function (error) {
            console.log(error);
        });
}
//   Fonction récursive pour identifier l'imdb le plus grand ?


async function movies_by_category(genre, limit = 7) {
    let query_parameters = "?genre=" + genre + "&limit=" + limit;
    const url_category = url + query_parameters;
    console.log(url_category);

    try {
        const response = await fetch(url_category);
        const data = await response.json();
        const movies = data.results;
        console.log(movies);
        return movies;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
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
    // document.getElementById(genre).innerHTML = genre;
    const buttons = document.querySelectorAll(`.categorie .btn`);
    buttons.forEach(button => {
        button.addEventListener('click', () => showMoviePopup(button.dataset.movieId));
    });
}

async function showMoviePopup(movieId) {
    try {
        const response = await fetch(url + movieId);
        const data = await response.json();
        console.log("uuuuuuuuuuuuuuuu")
        console.log(data)
        console.log("cssssssssss")

        // Afficher la pop-up
        const popup = document.getElementById('my-popup');
        const popupContent = document.getElementById('popup-content');
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
    `;
        popup.style.display = 'block';
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
    }
}

function closePopup() {
    const popup = document.getElementById('my-popup');
    popup.style.display = 'none';
}


async function main() {
    try {
        const mainMovies = get_main_movie();

        const genres = ["Adventure", "Drama", "Fantasy"];
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
