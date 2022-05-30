
var mongoose = require('/media/data/opt/nodejs/lib/node_modules/mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model ('user', new schema({
    name: String,
    password: String,
    email: String,
    platform: String,
}));
