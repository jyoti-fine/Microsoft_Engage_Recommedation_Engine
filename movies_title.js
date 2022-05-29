const pkg = require('xlsx')
var file = pkg.readFile("movies.csv")
var sheet_data = file.Sheets['Sheet1']
var data = pkg.utils.sheet_to_json(sheet_data);  //getting the data from excel sheet of movies title

var title_array =[];

for(let i=0;i<data.length;i++)           //getting rows in excel one by one and storing the values
{ 
    var title = data[i].original_title
    title_array.push(title)
}

let map=                  //converting into json
{
    title:title_array
}

let json=[map]         //getting list of map

module.exports =title_array      //export the title_array
