//栏目类别字段结构

const mongoose = require('mongoose');

let nodeSchema = new mongoose.Schema({
	nodeName: String,	//栏目名称
	nodeType: String,	//栏目类型
	nodeDesc: String	//栏目描述
});


module.exports = nodeSchema;