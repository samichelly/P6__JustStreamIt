const url = 'http://localhost:8000/api/v1/titles/';

// récupérer data best_movie
fetch(url + "?sort_by=-imdb_score&limit=1")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Echec : ' + response.status);
        }
    })
    .then(function (data) {
        let bestMovie = data.results[0]
        let title = bestMovie.title;
        let imdb_score = bestMovie.imdb_score;
        let image_url = bestMovie.image_url;
        let id = bestMovie.id;

        document.getElementById('title_best_movie').innerHTML = 'title : ' + title;
        document.getElementById('id_best_movie').innerHTML = 'id : ' + id;
        document.getElementById('imdb_best_movie').innerHTML = 'IMDB Score : ' + imdb_score;
        document.getElementById('image_best_movie').innerHTML = '<img src="' + image_url + '">';
    })
    .catch(function (error) {
        console.log(error);
    });

//   Fonction récursive pour identifier l'imdb le plus grand ?

//  Carrousel


function movies_by_category() {
    const genres = ["Adventure", "Drama", "Fantasy"]
    for (const genre of genres) {
        console.log(genre)

        let query_parameters = "?genre=" + genre + "&limit=7"
        const url_category = url + query_parameters
        console.log(url_category)
        fetch(url_category)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                console.log(movies)

                const swiperWrapper = document.querySelector('.swiper-wrapper');

                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('swiper-slide');
                    movieCard.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${movie.image_url}" alt="${movie.title}" />
        <button class="btn" href="">More details</button>`;
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
            });
        document.getElementById('categorie1').innerHTML = genre;
    }
}


// movies_by_category()

function movie_details(id) {
    const url_id = url + id
    console.log(url_id)
    fetch(url_category)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Echec : ' + response.status);
            }
        })
        .then(function (data) {
            document.getElementById('title_movie').innerHTML = 'title : ' + data['title'];
            document.getElementById('genre_movie').innerHTML = 'genre : ' + data['genres'];
            document.getElementById('year_movie').innerHTML = 'year : ' + data['year'];
            document.getElementById('imdb_movie').innerHTML = 'IMDB Score : ' + data['imdb_score'];
            document.getElementById('image_movie').innerHTML = '<img src="' + data['image_url'] + '">';
        })
        .catch(function (error) {
            console.log(error);
        });

}




// lancer API détail film, il faut envoyer id du film qu'il faudra ajouter dans l'URL à requêter