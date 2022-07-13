const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_HOST, {useNewUrlParser: true, useUnifiedTopology: true} );

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', function() {
    console.log("database connected!");
});