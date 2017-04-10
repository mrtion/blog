//用户结构
const mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
	userName: String,	//用户名
	password: String,	//密码
	userType: String	//用户类型
});

//用户表结构
module.exports = usersSchema;