let express = require('express');
let swig = require('swig');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let Cookies = require('cookies');

//用户模型
let User = require('./model/users');
//栏目模型
let Nodes = require('./model/nodes');


let adminRouter = require('./router/admin.js');
let apiRouter = require('./router/api.js');
let mainRouter = require('./router/main.js');


let app = express();

//定义当前系统使用的模板引擎
app.engine('html',swig.renderFile);

//设置模板的目录
app.set('views','./views')
//注册所使用的模板引擎
app.set('views engine','html')

swig.setDefaults({cache:false});

//静态资源目录
app.use('/public',express.static(__dirname + '/public'));

app.use( bodyParser.urlencoded({ extended: false }) );

//获取用户信息
app.use( (req,res,next) =>{
	req.cookie = new Cookies(req,res);
	req.userInfo = null;
	if(req.cookie.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookie.get('userInfo'));
			User.findById(req.userInfo.id).then(function(d){
				req.userInfo.userType = d.userType;
				next()
			});
		}catch(e){
			console.log(e);
		}
	}
	
} );

//获取导航
app.use((req,res,next) => {
	req.navList = []
	Nodes.find({},(e,navList) => {
		if(navList){
			req.navList = navList;
		}
		next();
	});
});
//路由
app.use('/admin',adminRouter);	//后台路由
app.use('/api',apiRouter);	//API路由
app.use('/',mainRouter);	//前台路由
//连接mongodb
mongoose.connect('mongodb://localhost/blog',(err) => {
	if(err){
		console.log('connect fail!');
	}else{
		console.log('connect success!');
	}
});
app.listen(8888);
console.log('8888');