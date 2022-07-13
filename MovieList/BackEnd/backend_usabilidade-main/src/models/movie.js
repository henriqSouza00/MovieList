const mongoose = require('mongoose');
const { getFilmsByUserId } = require('./movie-by-user');

const { Schema, model } = mongoose;

const MovieSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String
});

const Movie = model('Movie', MovieSchema);


const createMovie = (req, res) => {
    const { _id, title, description, imageUrl } = req.body;

    const isUnfilledFields = !title || !description || !imageUrl;

    if(isUnfilledFields) return res.send({code: 404, error: "There are unfilled fields"});

    if(_id) {
        Movie.findById(_id, {
            title,
            email,
            imageUrl
        }, (err) => {
            if(err) return res.send({code: 503, error: err});

            return res.send({code: 201, data: "Successfully updated"})
        })
    } 

    if(!_id) {
        const newMovie = new Movie({
            title,
            description,
            imageUrl
        })

        newMovie.save((err, movie) => {
            if(err) return res.send({code: 503, error: err});

            return res.send({code: 201, data: movie});
        })
    }
}

const getAllFilms = (req, res) => {
    Movie.find({}, (err, movies) => {
        if(err) return res.send({code: 503, error: err});

        return res.send({code: 200, data: movies});
    })
}

const getMoviesFromUserId = async (req, res) => {

    const { email } = req.query;
    const ids = await getFilmsByUserId(email);
    const movieIds = ids.map(id => id.movieId);
    Movie.find({_id: {$in: movieIds}}, (err, movies) => {
        if(err) return res.send({code: 503, error: err});

        return res.send({code: 200, data: movies});
    })
}

module.exports = {
    createMovie,
    getAllFilms,
    getMoviesFromUserId
}