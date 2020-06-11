require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movie-data-small.json');
console.log("Hello, world!");

const app = express();

const morganStetting = process.env.NODE_ENV === 'production' ?
'tiny' : 'dev';
app.use(morgan(morganStetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next){

    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN;

    if (!authToken || authToken.split(' ')[1] !== apiToken ){
       return res.status(401).json({error: 'Unauthorized request'})
    }
    
    next()
})

function handleMovieRequest(req, res){

    let response = movies;

    if (req.query.genre){
       response = response.filter(movie => 
           movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
       )
    }
    
    if (req.query.country){
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
         )
     }  

     if (req.query.avg_vote){
         response = response.filter(movie =>
             parseInt(movie.avg_vote) >= parseInt(req.query.avg_vote)
          )
      }

    res.status(200).json(response)
}

app.get('/movie', handleMovieRequest)

app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production'){
        response = {error: {message: 'server error'}}
    } else {
        response = { error}
    }
    res.status(500).json(response)
})

module.exports = app;