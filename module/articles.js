//文章内容模型

const mongoose = require('mongoose');

const articleSchema = require('../schemas/articles');

let Articles = mongoose.model('Articles',articleSchema);

module.exports = Articles;