//评论结构
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let commentSchemas = new Schema({
	articleId: { //文章ID
		type: Schema.Types.ObjectId, 
		ref: 'Articles'
	},	
	articleTitle: String,	//文章标题
	userId: { //评论用户ID
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},		
	userName: String, //评论用户名	
	content: String,	//评论内容
	upDate: {			//更新时间
		type: Date,
		default: Date.now()
	}
})

module.exports = commentSchemas;