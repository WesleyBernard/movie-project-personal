(function () {

    const MOVIE_URL = `http://localhost:8080/movies`;

    function getOMDb(movieTitle) {
        return fetch(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${TREVOR_OMDb_key}`)
            .then(function (data) {
                // console.log(data);
                return data.json();
            }).then(function (data) {
                console.log(data);
                if (data.Response === 'False') {
                    alert(`Ooops, We can't find that title!`);
                    return;
                }
                return data;
            }).then(function (data) {
                console.log(data);
                let title = data.Title;
                let director = data.Director;
                let genres = data.Genre;
                let plot = data.Plot;
                let poster = data.Poster;
                let rating = parseInt(data.Ratings[0].Value);
                let year = parseInt(data.Year);
                let actors = data.Actors
                return addAMovie(title, director, genres, plot, poster, rating, year, actors);
            })
    }


    // getOMDb('it').then(function (){
    //     populateMovieList();
    // });

    function fetchAllMovies() {
        return fetch(MOVIE_URL)
            .then(function (res) {
                return res.json()
            }).then(function (allMovies) {
                return allMovies;
            })
    }


    function addAMovie(title, director, genres, plot, poster, rating, year, actors) {
        const MOVIE_INFO = [{
            title: title,
            director: director,
            genre: genres,
            plot: plot,
            poster: poster,
            rating: rating,
            year: year,
            actors: actors
        }]

        const OPTIONS = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(MOVIE_INFO),
        };

        return fetch(MOVIE_URL, OPTIONS)
            .then(function (res) {
                alert('New Movie Posted')
            }).then(populateMovieList);
    }

    function deleteAMovie(title) {
        const OPTIONS = {
            method: 'DELETE',
        }
        return fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                if (movie.title.toLowerCase() === title.toLowerCase()) {
                    // alert('Movie Deleted')
                    let id = parseInt(movie.id)
                    fetch(`${MOVIE_URL}/${id}`, OPTIONS)
                        .then(populateMovieList)
                    ;
                }

            }
        })
    }

    // deleteAMovie(301);

    function editMovie(title, director, genres, plot, poster, rating, year) {
        const MOVIE_INFO = {
            title: title,
            director: director,
            genre: genres,
            plot: plot,
            poster: poster,
            rating: rating,
            year: year,
        }
        const OPTIONS = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(MOVIE_INFO),
        }
        return fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                if ($('#editTitle').val().toLowerCase() === movie.title.toLowerCase()) {
                    alert('Movie Edited')
                    let id = parseInt(movie.id)
                    fetch(`${MOVIE_URL}/${id}`, OPTIONS)
                }
            }
        })
    }

    function populateMovie() {
        $('#movieSearchDiv').html('');
        return fetch(`${MOVIE_URL}`)

            .then(function (res) {
                return res.json()
            }).then(function (data) {
                for (const movie of data) {
                    if (movie.title.toLowerCase() === $('#searchBox').val().toLowerCase()) {
                        $('#movieSearchDiv').append(`<div class="card" style="width: 18rem;">
                         <div class="card-body">
                             <h5 class="card-title">${movie.title}</h5>
                             <h6 class="card-subtitle mb-2 text-muted">${movie.year}</h6>
                             <p class="card-text">${movie.plot}</p>
                             <div class="card-footer"><img src="${movie.poster}" alt="${movie.title} poster" width="200px"></div>
                       </div>
                     </div>`);
                    }
                }
            })
    }


    $('#searchButton').click(function (){
        let genreArray = [];

        // populateMovie();
        // $('#closeSearchWindow').removeClass('hide');

        fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                if (movie.title.toLowerCase() === $('#searchBox').val().toLowerCase()) {
                    $("#dblClickDiv").html("")
                    $('#dblClickDiv').append(`<div class="card" style="width: 18rem;">
                         <div class="card-body">
                             <h5 class="card-title">${movie.title}</h5>
                             <h6 class="card-subtitle mb-2 text-muted">${movie.year}</h6>
                             <p class="card-text">${movie.plot}</p>
                             <div class="card-footer"><img src="${movie.poster}" alt="${movie.title} poster" width="200px"></div>
                       </div>
                     </div>`);
                    $('#moviePoster').addClass('blur');
                    $('#dblClickModal').removeClass('hide');
                    $('html,body').animate({scrollTop: $('#dblClickModal').offset().top}, 'fast')

                }
                // console.log(movie.genre.toLowerCase().includes($('#searchBox').val().toLowerCase()));
                if(movie.genre.toLowerCase().includes($('#searchBox').val().toLowerCase())){
                    // alert('klasdlkfj');
                    genreArray.push(movie);
                }
            }
            if(genreArray.length > 0 ){
                console.log(genreArray);
                $('#moviePoster').html('');
                genreArray.forEach(function (movie){
                    $('#moviePoster').append(`<img title="${movie.title}" class="posters" src="${movie.poster}" alt="${movie.title} poster">`)
                })
            }

        })
    })

    $('#closeSearchWindow').click(function (){
        $('#movieSearchDiv').addClass('hide');
        $(this).addClass('hide');
    })

// setTimeout(fetchAllMovies, 1000)


    function populateMovieList() {
        $("#moviePoster").html('');
        return fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                if (movie.poster !== '') {
                    $('#moviePoster').append(`<img title="${movie.title}" class="posters" src="${movie.poster}" alt="${movie.title} poster">`)
                }
            }
            console.log(allMovies)
            $("#loadingScreen").text("Movies are loaded!")
        });

    }

    populateMovieList();


    $('#addMovieButton').click(function (e) {
        let title = $('#addTitle').val().split(' ')
        title = title.join('+');
        getOMDb(title);
        $('#addMovieModel').addClass('hide')
        $('#moviePoster').removeClass('blur');
        $('#addTitle').val('');
    })


    $("#showAddMovieForm").click(function () {
        $("#addMovieModel").toggleClass('hide')
        $('#moviePoster').addClass('blur');
    })


    $('#editMovieButton').click(function () {
        let title = $('#editTitle').val();
        let director = $('#editDirector').val();
        let genres = $('#editGenres').val();
        let plot = $('#editPlot').val();
        let poster = $('#editPoster').val();
        let rating = $('#editRating').val();
        let year = $('#editYear').val();
        editMovie(title, director, genres, plot, poster, rating, year).then(function () {
            populateMovieList().then(function () {
                $('#editMovieModel').addClass('hide');
                $('#moviePoster').removeClass('blur');
            });

        })
    })
    $('#closeEditWindowButton').click(function () {
        $('#editMovieModel').addClass('hide');
        $('#moviePoster').removeClass('blur');
    })
    $("#closeAddWindowButton").click(function () {
        $("#addMovieModel").addClass('hide');
        $('#moviePoster').removeClass('blur');
    })

    var targetTitle;
    $('#moviePoster').dblclick(function (event) {
        $('#moviePoster').addClass('blur');
        $('#dblClickDiv').html('')
        let target = event.target;
        targetTitle = target.title
        // console.log(targetTitle);
        $('#dblClickModal').removeClass('hide');
        $('html,body').animate({scrollTop: $('#dblClickModal').offset().top}, 'fast')
        fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                if (movie.poster === target.src) {
                    $('#dblClickDiv').append(`<div class="card" style="width: 18rem;">
                         <div class="card-body">
                             <h5 class="card-title">${movie.title}</h5>
                             <h6 class="card-subtitle mb-2 text-muted">${movie.year}</h6>
                             <p class="card-text">${movie.plot}</p>
                             <div class="card-footer"><img src="${movie.poster}" alt="${movie.title} poster" width="200px"></div>
                       </div>
                     </div>`);
                }
            }
        })
    })


    $('#dblclickDeleteButton').click(function () {
        // let title = $('#deleteBox').val();
        alert(targetTitle);
        deleteAMovie(targetTitle);
        $('#dblClickModal').addClass('hide');
        $('#moviePoster').removeClass('blur');
    })


    $('#dblclickCloseButton').click(function (event) {
        $('#dblClickModal').addClass('hide');
        $('#moviePoster').removeClass('blur');
    })

    $('#moviePoster').click(function (event) {
        $('#dblClickModal').addClass('hide');
        $('#moviePoster').removeClass('blur');
    })

    $('#resetButton').click(populateMovieList);


    $('#dblclickEditbutton').click(function () {
        $('#dblClickModal').addClass('hide');
        $('#oldMovieInfo').html('')
        fetchAllMovies().then(function (allMovies) {
            for (const movie of allMovies) {
                // console.log(movie.title);
                console.log(targetTitle);
                if (movie.title.toLowerCase() === targetTitle.toLowerCase()) {
                    // alert(movie.rating);
                    $('#editMovieModel').removeClass('hide');
                    return $('#oldMovieInfo').append(`
<!--//htmlformat--> 
<div id="editAMovieForm">
<span>Title: </span><input class="m-2 col-3" id="editTitle" type="text" value='${movie.title}'>
<label for="editTitle"></label>
<span>Director: </span><input class="m-2 col-3" id="editDirector" type="text" value='${movie.director}'><br>
<label for="editDirector"></label>
<tspan>Poster: </tspan><input class="m-2 col-10" id="editPoster" type="text" value='${movie.poster}'>
<label for="editPoster"></label>
<tspan>Rating: </tspan><input class="m-2 col-3" id="editRating" type="text" value='${movie.rating}'>
<label for="editRating"></label>
<tspan>Year: </tspan><input class="m-2 col-3" id="editYear" type="text" value='${movie.year}'><br>
<label for="editYear"></label>
<span>Genre: </span>
<input class="m-2 col-3" id="editGenres" type="text" value='${movie.genre}'><br>
<label for="editGenres"></label>
<span>Plot: </span><input  class="m-2 col-10" id="editPlot"  value='${movie.plot}'>
</div>`)
                }
            }
        })
    })
})();