let express = require('express');
let router = require('./router/router.js');
let swig = require('swig');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let Cookies = require('cookies');

//用户模型
let User = require('./module/users');
//栏目模型
let Nodes = require('./module/nodes');


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
	//console.log(req.cookie.get('userInfo'))
	req.userInfo = null;
	if(req.cookie.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookie.get('userInfo'));
			User.findById(req.userInfo.id).then(function(d){
				
				req.userInfo.userType = d.userType;

				//console.log(req.userInfo);
			});

		}catch(e){
			console.log(e);
		}
		
	}

	next()
} );

//获取导航
app.use((req,res,next) => {
	req.navList = []
	Nodes.find({},function(e,navList){
		if(navList){
			req.navList = navList;
		}
	})
	next();
})

// //首页
// app.get('/',router.index)

app.use('/admin',adminRouter);
app.use('/api',apiRouter);
app.use('/',mainRouter);


mongoose.connect('mongodb://localhost/blog',(err) => {
	if(err){
		console.log('sb');
	}else{
		console.log('cg');
	}
});
app.listen(8888);