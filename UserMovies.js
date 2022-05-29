const mongoose = require('mongoose');

const userMoviesSchema = new mongoose.Schema({
  nameUser: String,
  likedMovies: Array

})


var userMovies = mongoose.model('UserMovie', userMoviesSchema);


module.exports = userMovies