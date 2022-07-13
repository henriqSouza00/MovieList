const mongoose = require('mongoose');
const { User } = require('./user');

const { Schema, model, ObjectId } = mongoose;

const MovieByUserSchema = new Schema({
    userId: ObjectId,
    movieId: ObjectId
});

const MovieByUser = model('MovieByUser', MovieByUserSchema);


const addMovieToUserList = async (req, res) => {
    const { email, movieId } = req.body;
    const isUnfilledFields = !email || !movieId;

    const u = await User.findOne({email: email});

    if(isUnfilledFields) return res.send({code: 404, error: "There are unfilled fields"});

    const newMovieByUser = new MovieByUser({
        userId: u._id,
        movieId
    });

    newMovieByUser.save((err, movie) => {
        if(err) return res.send({code: 503, error: err});

        return res.send({code: 201, data: movie});
    })
}

const removeMovieFromUserList = async (req, res) => {
    const { email, movieId } = req.query;
    const isUnfilledFields = !email || !movieId;

    const u = await User.findOne({email: email});

    if(isUnfilledFields) return res.send({code: 404, error: "There are unfilled fields"});


    MovieByUser.deleteOne({
        userId: u._id,
        movieId
    }, (err, movie) => {
        if(err) return res.send({code: 503, error: err});

        return res.send({code: 200, data: movie});
    })
}


const getFilmsByUserId = async (email) => {
    const u = await User.findOne({email: email});
    return MovieByUser.find({userId: u._id}, (err, movieIds) => {
        if(err) return [];
        return movieIds;
    })
}

module.exports = {
    addMovieToUserList,
    getFilmsByUserId,
    removeMovieFromUserList
}