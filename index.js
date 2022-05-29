const express = require("express");
const {spawn} = require('child_process');
const fs = require("fs");
const app = express();  
const path = require("path")
const bodyparser=require("body-parser")
const mongoose = require('mongoose');
const spawner = require('child_process').spawn
mongoose.connect('mongodb://localhost/RecommendMovies',{ useUnifiedTopology: true,useNewUrlParser: true }).catch(err => console.log(err));;
const userMovies = require('./UserMovies');
const { param } = require("express/lib/request");

let username="jyoti"      //username to show the recommended movies
const port = 80;

app.use('/static',express.static('static'))   //to fetch static files
app.use(express.urlencoded()) 
 
app.set('view engine', 'pug');                //show templates
app.set("views",path.join(__dirname,'views'))

app.get('/',(req, res) =>                     //to show index page of the appltcation
{
    res.status(200).render('index.pug');
    const childPython = spawn('python',['index.py'])
})

app.post('/recommend',(req, res) =>        //get the searched movie name after post request
{
  let movie = req.body['searched_movies']

  if(movie!='')                             //fetching the data and updating in database
  {
      userMovies.find({"nameUser":username},function(err,userMoviesItems)
      {
        if(err) console.warn(err)
        if(userMoviesItems.length!=0)
        {
            userMoviesItems[0]['likedMovies'].splice(0, 0, movie);
            let userMoviesUpdatedUtems = userMoviesItems[0]['likedMovies']
            userMoviesItem = new userMovies({nameUser:username,likedMovies: userMoviesUpdatedUtems})
          
            userMovies.deleteMany ({"nameUser": username},function(err,userMovies)
            {
              if(err) return console.error(err);
            })
          
            userMoviesItem.save(function (err, userMovies){
            if(err) return console.error(err);
            })
        }
        else
        {
          userMoviesItemNew = new userMovies({nameUser:username,likedMovies:[movie]})
          userMoviesItemNew.save(function (err, userMoviesItemNew)
          {
            if(err) return console.error(err);  
          })
        }

      })
  }

  userMovies.find({"nameUser":username},function(err,userMoviesItems)
  {
    if(err) console.warn(err)
    content = JSON.stringify(userMoviesItems)
    
    fs.writeFile('movies_seen.json', content, err =>        //writing the user's watched movies in json file
    {
      if (err) 
      {
        console.error(err);
      }
    })
  })

  const childPython = spawn('python',['index.py'])          //Running the ML Model

  const params=
  {
    "movies_title": movie
  }
  res.status(200).render('choose.pug',params);
})  

app.listen(port,()=>                              //listening at post 80
{
    console.log(`the app started successfully on port ${port}`)
});
