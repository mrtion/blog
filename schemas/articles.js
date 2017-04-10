//文章内容结构
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
	nodeId: String,	//文章栏目ID
	title: String,	//文章标题
	upDate: {	//文章添加时间
		type: Date,
		defualt: Date.now()
	},
	author: String,	//文章作者
	desc: String,	//文章简介
	source: String,	//文章来源
	content: String	//文章内容
});

module.exports = articleSchema;