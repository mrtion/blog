//评论结构
const mongoose = require('mongoose');

let commentSchemas = new mongoose.Schema({
	articleId: String,	//文章ID
	articleTitle: String,	//文章标题
	userId: String,		//评论用户ID
	userName: String,	//评论用户名
	content: String,	//评论内容
	upDate: {			//更新时间
		type: Date,
		default: Date.now()
	}
})

module.exports = commentSchemas;