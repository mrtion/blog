//文章内容结构
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const articleSchema = new Schema({
	nodeId: { //文章栏目ID
		type: Schema.Types.ObjectId, 
		ref: 'Nodes'
	},	
	title: String,	//文章标题
	upDate: {	//文章添加时间
		type: Date,
		defualt: new Date()
	},
	author: String,	//文章作者
	desc: String,	//文章简介
	source: String,	//文章来源
	content: String	//文章内容
});

module.exports = articleSchema;