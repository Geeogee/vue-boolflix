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
                        .get("https://api.themoviedb.org/3/search/movie", {
                
                                params: {
                                    "api_key" : "06c75c4950ae895301a9d9124ffca723",
                                    "query" : this.searchKey
                                }
                            })
                        .then(data => {
    
                            this.results = data.data.results;
                            console.log(this.results)
                        })
                        .catch(() => console.log("Error!"))
                }
            }
        }
    })
}

function init() {

    initVue();
}

document.addEventListener("DOMContentLoaded", init)