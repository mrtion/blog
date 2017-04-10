//评论模型
const mongoose = require('mongoose');

let commentSchemas = require('../schemas/comments.js')

let Comments = mongoose.model('Comments',commentSchemas)

module.exports = Comments;