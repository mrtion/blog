const express = require('express');
//时间格式模块
const moment = require('moment');
const router = express.Router();


//用户模型
const User = require('../module/users');
//栏目模型
const Nodes = require('../module/nodes');
//文章模型
const Articles = require('../module/articles');
//评论模型
const Comments = require('../module/comments');

router.get('/*',function(req,res,next){

	if(req.userInfo.userName != 'admin'){
		res.redirect('/');
		res.end('')
	}else{
		next();
	}
	
});

//后台首页
router.get('/',function(req,res){

	User.find({userType : "0"}).then(function(d){

		let lists = []
		if(d){
			lists = d
		}
		//console.log(lists)
		res.render('./admin/index.html',{
			"title":"后台首页",
			"userList" : lists
		})
	},function(e){
		res.render('./admin/index.html',{
			"title":"后台首页",
			"userList" : []
		})
	});
})

//用户管理列表
router.get('/userList/',(req,res) => {

	let count = 0;
	let limit = 10; 	//每页显示的条数
	let pages = 0;	//总页数据
	let page = 0;	//当前页
	let skip = 0;	//跳过的条数

	page = parseInt(req.query.page);

	User.count().then(function(d){
		count = d;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		User.find().skip(skip).limit(limit).then(function(d){
			let lists = []
			if(d){
				lists = d
			}
			res.render('./admin/users/userlist.html',{
				"title":"用户管理",
				"userList" : lists,
				"page": page,
				"pages": pages,
				"count": count
			})
		},function(e){
			res.render('./admin/users/userlist.html',{
				"title":"用户管理",
				"userList" : []
			});
		});
	});
});
/*
*	新增和编辑用户
*	当req.query.userId存在时为编辑否则为新增
*/

router.get('/setUser',(req,res) =>{
	//保存userId
	let userId = req.query.userId ? req.query.userId : '';
	//当userId有值时，根据这个ID查询用户信息 
	if(userId){
		User.findById(userId).then((uDetail) => {
			if(uDetail){
				res.render('./admin/users/setUser.html',{
					title: "编辑用户",
					userDetail: uDetail
				})
			}else{
				res.render('./admin/error.html',{
					title: "出错了！",
					info: "不存在的用户ID",
					url: "/admin/userList",
					urlName: "返回列表"
				})
			}
		},(e) => {
			res.render('./admin/error.html',{
				title: "出错了！",
				info: "不存在的用户ID",
				url: "/admin/userList",
				urlName: "返回列表"
			})
		});
	}else{
		res.render('./admin/users/setUser.html',{
			title: "添加用户",
			userDetail: null
		})
	}	
});
/*
*	新增和编辑用户
*	POST
*	当req.body.userId存在时为编辑否则为新增
*/
router.post('/setUser',(req,res) => {
	let url = '/admin'+req.url
	let userName = req.body.userName;
	let password = req.body.password;
	let userType = req.body.userType;
	let userId = req.body.userId ? req.body.userId : '';

	//更新当前用户
	if(userId){
		User.findById(userId).then((uDetail) =>{
			if(uDetail){
				return User.update({_id:userId},{
					userName: userName,
					password: password,
					userType: userType
				})
			}
		}).then((d) => {
			if(d){
				res.render('./admin/success.html',{
					title: "保存成功",
					info: "保存成功",
					url: "/admin/userList",
					urlName: "返回列表"
				});				
			}else{
				res.render('./admin/error.html',{
					title: "出错了！",
					info: "保存失败，请重试",
					url: url,
					urlName: "继续编辑"
				});
			}
		});
	}else{
		User.findOne({userName:userName}).then( (d)=> {
			if(d){
				res.render('./admin/error.html',{
					title: "出错了！",
					info: "用户名已经在存",
					url: url,
					urlName: "重新添加"
				});
			}else{
				new User({
					userName: userName,
					password: password,
					userType: userType
				}).save((d) => {
					if(d){
						res.render('./admin/success.html',{
							title: "保存成功",
							info: "保存成功",
							url: "/admin/userList",
							urlName: "返回列表"
						});
					}else{
						res.render('./admin/error.html',{
							title: "出错了！",
							info: "保存失败，请重试eeee",
							url: url,
							urlName: "重新添加"
						});
					}
				});
			}
		}).catch( (e) =>{
			res.render('./admin/error.html',{
				title: "出错了！",
				info: "保存失败，请重试eeee",
				url: url,
				urlName: "重新添加"
			});
		});
	}
	
});

//栏目管理列表
router.get('/nodeList/',(req,res) => {

	Nodes.find().then(function(d){
		let nodeList = []
		if(d){
			nodeList = d
		}
		console.log(nodeList)
		res.render('./admin/nodes/nodelist.html',{
			"title":"栏目管理",
			"nodeList" : nodeList
		})
	},function(e){
		res.render('./admin/nodes/nodelist.html',{
			"title":"栏目管理",
			"nodeList" : []
		})
	});
});

//文章管理列表
router.get(/^(\/articlelist)+(\/(\w)+)?$/,(req,res) => {
	var artList = [];
	var nodeNames = {};
	var id = req.params[1] ? req.params[1].substr(1) : '';
	//console.log(id)
	var param = id ? {nodeId:id} : {};

	let count = 1;
	let limit = 10; 	//每页显示的条数
	let pages = 1;	//总页数据
	let page = 1;	//当前页
	let skip = 1;	//跳过的条数

	page = parseInt(req.query.page);

	Articles.count(param).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);

		page = page > 1 ? page > pages ? pages : page : 1;

		skip = (page - 1) * limit;

		Articles.find(param).skip(skip).limit(limit).then(function(list){
			if(list){
				//artList = d;
				Nodes.find({}).then(function(d){
					if(d){
						d.forEach(function(item){
							nodeNames[item._id.toString()] = item.nodeName;
						});
					}

					list.forEach(function(item){
						item['nodeName'] = nodeNames[item.nodeId];
						item['upDated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
						
						artList.push(item);
					});

					
					//console.log(artList);

					res.render('./admin/articles/articlelist.html',{
						title:"文章管理",
						artList: artList,
						nodeNames: nodeNames,
						"page": page,
						"pages": pages,
						"count": count
					})
				},function(e){
					res.render('./admin/articles/articlelist.html',{
						title:"文章管理",
						artList: artList,
						nodeNames: nodeNames,
						"page": page,
						"pages": pages,
						"count": count
					})
				})
			}

		},function(e){
			res.render('./admin/articles/articlelist.html',{
				title:"文章管理",
				artList: artList,
				"page": page,
				"pages": pages,
				"count": count
			})
		})

	});

	
});

//添加文章
router.get('/addArticle',(req,res) => {
	let nodeList = [];
	Nodes.find({}).then(function(d){
		if(d){
			nodeList = d;
		}

		res.render('./admin/articles/addarticle.html',{
			title: "添加文章",
			nodeList: nodeList
		})
	},function(e){
		res.render('./admin/articles/addarticle.html',{
			title: "添加文章"
		})
	})

	
});


//评价管理
router.get('/comment',(req,res) => {

	//获取评论列表
	let count = 0;
	let limit = 10; 	//每页显示的条数
	let pages = 0;	//总页数据
	let page = 0;	//当前页
	let skip = 0;	//跳过的条数

	page = parseInt(req.query.page);

	Comments.count({}).then((total) => {
		count = total;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;

		return Comments.find({}).skip(skip).limit(limit);

	}).then((d) => {
		d.forEach( (item) => {
			item['upDated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
		} );

		res.render('./admin/comments/comment_index.html',{
			title:'评价管理',
			CommentList : d,
			page: page,
			pages: pages,
			count: count,
			limit: limit
		})
	});


	
});

module.exports = router;