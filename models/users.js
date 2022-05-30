
var mongoos = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model ('user', new schema({
    name: String,
    password: string,
    email: String,
    platform: String,
    admin: Boolean, 
}));
