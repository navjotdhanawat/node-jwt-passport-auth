var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var userSchema = Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});
var User = mongoose.model('User', userSchema);


module.exports = { User };
