function initVue() {

    new Vue({

        el : "#app",
        data : {

            "searchKey" : "avengers",
            "results" : [],
            "allGenres" : [],
            "genres" : [],
            "filterKey" : "",
            "infos" : false
        },

        methods : {

            getSearchResults: function() {
            
                if (this.searchKey.length > 0) {
                    
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
                    
                    axios
                        .get("https://api.themoviedb.org/3/genre/movie/list", {

                                params: {
                                    "api_key" : "06c75c4950ae895301a9d9124ffca723"
                                }
                        })
                        .then(data => {

                            this.allGenres = data.data.genres;
                        })
                        .catch(() => console.log("Error!"))
                }
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
                const size = "w342";
                const path = film.poster_path;

                return `${baseURL}${size}${path}`
            }
        },

        computed: {

            arrayFilter: function() {

                return this.results.filter(result => result.media_type != "person")
            },

            getGenres: function() {

                this.results.forEach(result => {

                    result.genre_ids.forEach(genre_id => {

                        if (!this.genres.includes(genre_id))
                            this.genres.push(genre_id)
                    })
                })

                return this.genres
            },

            filterByGenre: function() {

                if (this.filterKey == "") {

                    return this.arrayFilter
                } else {

                    return this.arrayFilter.filter(result => {

                        return result.genre_ids.includes(parseInt(this.filterKey));
                    })
                }
            }


        },

        filters: {

            showStars: function(vote) {

                const fullStar = `<i class="fas fa-star"></i>`;
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