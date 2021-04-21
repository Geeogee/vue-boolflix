function initVue() {

    new Vue({

        el : "#app",
        data : {

            "searchKey" : "",
            "results" : [],
            "movieGenres" : [],
            "tvGenres" : [],
            "allGenres" : [],
            "searchGenres" : [],
            "filterKey" : "",
            "infos" : false,
            "cast" : [],
            "show" : false,
            "movieID" : ""
        },

        methods : {

            getSearchResults: function() {
                
                
                if (this.searchKey.length > 0) {
                    
                    // Get Movies and Tv Series
                    axios
                        .get("https://api.themoviedb.org/3/search/multi", {
                
                                params: {
                                    "api_key" : "06c75c4950ae895301a9d9124ffca723",
                                    "query" : this.searchKey
                                }
                        })
                        .then(data => {
    
                            this.results = data.data.results;

                            
                        })
                        .catch(() => console.log("Error!"));
                    
                    // Get Movies Genres
                    axios
                        .get("https://api.themoviedb.org/3/genre/movie/list", {

                                params: {
                                    "api_key" : "06c75c4950ae895301a9d9124ffca723"
                                }
                        })
                        .then(data => {

                            this.movieGenres = data.data.genres;
                        })
                        .catch(() => console.log("Error!"))

                    // Get Tv Genres
                    axios
                        .get("https://api.themoviedb.org/3/genre/tv/list", {

                            params: {
                                "api_key" : "06c75c4950ae895301a9d9124ffca723"
                            }
                        })
                        .then(data => {

                            this.tvGenres = data.data.genres;
                        })
                        .catch(() => console.log("Error!"))

                }
            },

            getCastInfos: function(id) {

                axios
                    .get(`https://api.themoviedb.org/3/movie/${id}/credits`, {

                        params: {
                            "api_key" : "06c75c4950ae895301a9d9124ffca723"
                        }
                    })
                    .then(data => {

                        this.movieID = data.data.id;
                        this.show = !this.show;
                        this.cast = data.data.cast.splice(0,5);
                    })
                    .catch(() => console.log("Errors!"))
            },

            getLanguage: function(lang) {

                switch(lang) {

                    case "en":
                        return "gb";
                    case "it":
                        return "it";
                    case "ja":
                        return "jp"; 
                }
            },

            getImageURL: function(film) {

                const baseURL = "https://image.tmdb.org/t/p/";
                const size = "w780";
                const path = film.poster_path;

                return `${baseURL}${size}${path}`
            }
        },

        computed: {

            arrayFilter: function() {

                return this.results.filter(result => result.media_type != "person")
            },

            getGenres: function() {

                this.searchGenres = [];

                // Spread Movies and TV Series genres
                // In one array

                this.allGenres = [...this.movieGenres, ...this.tvGenres];
                // Compare the i-element with every other element
                // inside the array
                // If there are duplicates
                // Using splice() the duplicate will be removed
                for (let i=0; i<this.allGenres.length; i++) {

                    for (let j=i+1; j<this.allGenres.length; j++) {

                        if (this.allGenres[i].id == this.allGenres[j].id) {

                            this.allGenres.splice(j,1)
                        }
                    }
                }

                // USING SET FOR ELIMATES DUPLICATES
                // this.allGenres = [...new Set([...this.movieGenres, ...this.tvGenres])];

                this.allGenres.sort();

                // Get genre ids only for the searched films
                this.results.forEach(film => {

                    film.genre_ids.forEach(genre => {

                        if (!this.searchGenres.includes(genre))
                            this.searchGenres.push(genre);
                    })
                })

                // Only returns generes 
                // Of searched films
                this.allGenres.forEach(genre => {

                    if (this.searchGenres.includes(genre.id)) {

                        const index = this.searchGenres.indexOf(genre.id);
                        const name = genre.name;
                        this.searchGenres[index] = name;
                    }   
                })
    
                return this.searchGenres
            },

            filterByGenre: function() {

                if (this.filterKey == "") {

                    return this.arrayFilter
                } else {

                    let id;
                    this.allGenres.forEach(genre => {

                        if (genre.name == this.filterKey) {
                            id = genre.id;
                        }  
                    })
                    return this.arrayFilter.filter(film => film.genre_ids.includes(id)); 
                }
            },

        },

        filters: {

            showStars: function(vote) {

                const fullStar = `<i class="fas fa-star yellow"></i>`;
                const emptyStar = `<i class="far fa-star"></i>`;
                const fullStarValue = Math.round(vote / 2);
                const emptyStarValue = 5 - fullStarValue;
                let voteString = `${fullStar.repeat(fullStarValue)}${emptyStar.repeat(emptyStarValue)}`;
            
                return voteString
            }
        }
    })
}

function init() {

    initVue();
}

document.addEventListener("DOMContentLoaded", init)