require('dotenv/config');
require('./config/mongo');
const films = require('./asset/films.json');

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const validateJWT = require('./authToken');

//Models Functions
const { signUp, signIn, updateUser } = require("./models/user");
const { createMovie, getAllFilms, getMoviesFromUserId } = require('./models/movie');
const { addMovieToUserList, removeMovieFromUserList } = require('./models/movie-by-user');


// Configuring Express
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.route('/signup')
    .post((req, res) => signUp(req, res))

app.route('/signin')
    .post((req, res) => signIn(req, res))

// ⬇⬇⬇ Endpoints that need authentication to be called ⬇⬇⬇
app.use(validateJWT);
    

app.route('/user')
    .put((req, res) => updateUser(req, res))

app.route('/filmes')
    .post((req, res) => createMovie(req, res))
    .get((req, res) => getAllFilms(req, res))

app.route('/filmes/list')
    .post((req, res) => addMovieToUserList(req, res))
    .get((req, res) => getMoviesFromUserId(req, res))
    .delete((req, res) => removeMovieFromUserList(req, res))

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend is running in port " + process.env.PORT || 5000);
})


