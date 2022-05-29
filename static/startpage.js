const parentDOM = document.getElementById("search_engine");
const input = parentDOM.getElementsByClassName("search_movies")[0]
const sugg = parentDOM.getElementsByClassName('list_item')[0];
const icon = parentDOM.getElementsByClassName('icon')[0]
let linkTag = parentDOM.querySelector("a");

let nextRecMovie = []
let nextRec
        
let movies_title_array = new Array();

function getData()            //Fetching Movies Details From Api
{
    url = "../static/movies_title_api.json"

    fetch(url).then((response)=>
    {
        return response.text();

    }).then((data)=>{

        obj=JSON.parse(data)
        movies_title_array= obj["title"]

    })
}

getData()

input.onkeyup = (e)=>
{
    let userData = e.target.value;        //take user data
    userData = capitalizeFirstLetter(userData)
    
    let emptyArray = [];

    if(userData)
    {
        icon.onclick = ()=>       //on searching
        {
            nextRec = input.value
            input.value=""
            sugg.classList.remove("active");      //hide autocomplete box
            sugg.innerHTML=''
            console.log(nextRec)

            recommend(movies_title_array,nextRec)     //Recomend Movies On Searching
        }
        emptyArray = movies_title_array.filter((data)=>
        {
            data =data.toString();
            return data.startsWith(userData);
        });

        emptyArray = emptyArray.map((data)=>
        {
            return data = `<li>${data}</li>`;      // passing return data inside li tag
        });

        sugg.classList.add("active");           //show autocomplete box
        showSuggestions(emptyArray);
        let allList = sugg.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) 
        {
            allList[i].setAttribute("onclick", "select(this)");
        }
    }
    else
    {
        sugg.classList.remove("active"); //hide autocomplete box
        sugg.innerHTML=''
    }
}

function select(element)               //on selecting a movie
{
    let selectData = element.textContent;
    input.value = selectData;
    icon.onclick = ()=>
    {
        nextRec = input.value;                 // take the searched movie
    } 
    sugg.classList.remove("active");           //remove the shown list 
    input.value=element.textContent;
    nextRec = input.value;
    sugg.innerHTML=''
}


function showSuggestions(list)
{                               //show the list of movies according to typed data
    let listData;
    if(!list.length)
    {
        userValue = input.value;
        listData = `<li>${userValue}</li>`;
    }
    else
    {
        listData = list.join('');
    }
    sugg.innerHTML = listData;
}



function recommend(movies_title_array,nextRec)        //show recommended movies
{
    url = "../static/recommended_movies.json"
    fetch(url).then((response)=>
    {
        return response.text();
    }).then((data)=>
    {
        obj=JSON.parse(data)
        movies_recommended = obj['recommend']

        var x = "";
        for (i = 0; i <18 && i<movies_recommended.length; i++) {
            x = x + '<div class="carousel-cell">' + movies_recommended[i] + '</div>';
        }

        document.getElementById("carousel").innerHTML = x;
   })
}

function capitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

