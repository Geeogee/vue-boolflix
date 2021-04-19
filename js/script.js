function initVue() {

    new Vue({

        el : "#app",
        data : {

            "searchKey" : "",
            "results" : []
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
                        .catch(() => console.log("Error!"))
                }
            },

            getImageURL: function(film) {

                const baseURL = "https://image.tmdb.org/t/p/";
                const size = "w154";
                const path = film.poster_path;

                return `${baseURL}${size}${path}`
            }
        },

        computed: {

            arrayFilter: function() {

                return this.results.filter(result => result.media_type != "person")
            }
        },

        filters: {

            showStars: function(vote) {

                const fullStar = `<i class="fas fa-star"></i>`;
                const emptyStar = `<i class="far fa-star"></i>`;
                const fullStarValue = Math.round(vote / 2);
                const emptyStarValue = 5 - fullStarValue;

                let voteString = fullStar.repeat(fullStarValue) + emptyStar.repeat(emptyStarValue);
                

                return voteString
            }
        }
    })
}

function init() {

    initVue();
}

document.addEventListener("DOMContentLoaded", init)