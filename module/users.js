const mongoose = require('mongoose');

let usersSchema = require('../schemas/users');

let User = mongoose.model('User',usersSchema);

module.exports = User;