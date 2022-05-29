url = "../static/recommended_movies.json"       //fetch data of recommended movies

movies_recommended = []

fetch(url).then((response) => {

    return response.text();

}).then((data) => 
{
    obj = JSON.parse(data)
    movies_recommended = obj['recommend']      //rendering the recommended movies and displaying 

    var x = "";
    for (i =0; i < 18 && i<movies_recommended.length; i++) {
        x = x+'<div class="container"><div class="card" style="background-color:rgb(194, 183, 183);"><div class="card-header "></div><div class="card-body" style="text-align: center;"><blockquote class="blockquote mb-0"><p class="cell">'+movies_recommended[i] +'</p></blockquote></div></div></div>'
    }

    if(x=='')
    {
        x='<div style="color:white; text-align:center;">Choose The Movies You Want To Watch</div>'
    }

    document.getElementById("list").innerHTML = x;
})