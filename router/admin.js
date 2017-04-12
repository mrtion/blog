const express = require('express');
//时间格式模块
const moment = require('moment');
const router = express.Router();


//用户模型
const User = require('../model/users');
//栏目模型
const Nodes = require('../model/nodes');
//文章模型
const Articles = require('../model/articles');
//评论模型
const Comments = require('../model/comments');

/*
*  判读当前用户是不是admin
*  不跳到首台首页
*/
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

	var indexObj = {
		userTotal:0,
		nodes: [],
		artTotal: 0,
		commentTotal:0
	}
	//统计用户数
	User.count().then((userTotal) => {
		indexObj.userTotal = userTotal ? userTotal : 0;
		//获取栏目列表
		return Nodes.find().sort({_id:-1});
	}).then( (list) => {
		indexObj.nodes = list ? list : [];
		//统计文章数
		return Articles.count();
	}).then((artTotal) => {
		indexObj.artTotal = artTotal ? artTotal : 0;
		//统计评论数
		return Comments.count();
	}).then( (commentTotal) => {
		indexObj.commentTotal = commentTotal ? commentTotal : 0;
		res.render('./admin/index.html',{
			"title":"后台首页",
			"indexObj" : indexObj
		})
	})

})

//用户管理列表
router.get('/userList/',(req,res) => {
	let count = 0;
	let limit = 10; 	//每页显示的条数
	let pages = 0;	//总页数据
	let page = 0;	//当前页
	let skip = 0;	//跳过的条数
	page = parseInt(req.query.page);
	//获取用户总条数
	User.count().then(function(d){
		count = d;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		//按ID倒序查询全部用户，并实现分页
		return User.find().sort({_id:-1}).skip(skip).limit(limit);
	}).then((d) => {
		let lists = d ? d : [];
		res.render('./admin/users/userlist.html',{
			"title":"用户管理",
			"userList" : lists,
			"page": page,
			"pages": pages,
			"count": count
		})
	},(e) => {
		res.render('./admin/users/userlist.html',{
			"title":"用户管理",
			"userList" : []
		});
	}).catch((e) => {
		console.log(e);
		ren.end("500");
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
				Promise.reject();
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

	let exist = '';
	//页面提示信息
	let tipInfo = {
		title: '出错了！',
		info: '保存失败，请重试',
		url : url,
		urlName: '继续编辑'
	}

	//更新当前用户
	if(userId){
		User.findById(userId).then((uDetail) =>{
			if(uDetail){
				return User.update({_id:userId},{
					userName: userName,
					password: password,
					userType: userType
				})
			}else{
				Promise.resolve();
			}
		}).then((d) => {
			if(d){
				tipInfo.title = '保存成功';
				tipInfo.info = '保存成功';
				tipInfo.url = '/admin/userList';
				tipInfo.urlName = '返回列表';				
			}else{
				tipInfo.url = url+'?userId='+userId;
			}
			res.render('./admin/error.html',tipInfo);

		}).catch( (e) =>{
			console.log(e);
			res.end("500");
		});
	}else{
		User.findOne({userName:userName}).then( (d)=> {
			if(d){
				exist = 'exist';
				Promise.resolve();
			}else{
				return new User({
					userName: userName,
					password: password,
					userType: userType
				}).save();
			}
		}).then( (d) => {
			if(exist){
				tipInfo.title = "出错了！";
				tipInfo.info = "用户名已经在存";
				tipInfo.urlName = "重新添加";
			}else if(d && d != 'exist'){
				tipInfo.title = "保存成功";
				tipInfo.info = "保存成功";
				tipInfo.url = "/admin/userList";
				tipInfo.urlName = "返回列表";
			}else{
				tipInfo.urlName = "重新添加";
			}

			res.render('./admin/error.html',tipInfo);

		}).catch( (e) =>{
			console.log(e);
			res.end("500");
		});
	}
});

//栏目管理列表
router.get('/nodeList/',(req,res) => {
	Nodes.find().then(function(d){
		let nodeList = d ? d : [];
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

/*
*	新增和编辑栏目
*	当req.query.nodeId存在时为编辑否则为新增
*/
router.get('/setNode',(req,res) => {
	//保存nodeId
	let nodeId = req.query.nodeId ? req.query.nodeId : '';

	//当userId有值时，根据这个ID查询用户信息 
	if(nodeId){
		Nodes.findById(nodeId).then((nDetail) => {
			if(nDetail){
				res.render('./admin/nodes/setNode.html',{
					title: "编辑栏目",
					nDetail: nDetail
				})
			}else{
				Promise.reject();
			}
		},(e) => {
			res.render('./admin/error.html',{
				title: "出错了！",
				info: "不存在的栏目ID",
				url: "/admin/nodeList",
				urlName: "返回列表"
			})
		});
	}else{
		res.render('./admin/nodes/setNode.html',{
			title: "添加栏目",
			nDetail: null
		})
	}
});

/*
*	新增和编辑栏目
*	当req.query.nodeId 存在时为编辑否则为新增
*/
router.post('/setNode',(req,res) => {
	let url = '/admin'+req.url
	let nodeName = req.body.nodeNames;
	let desc = req.body.desc;
	let nodeId = req.body.nodeId ? req.body.nodeId : '';
	let exist = '';
	//页面提示信息
	let tipInfo = {
		title: '出错了！',
		info: '保存失败，请重试',
		url : url,
		urlName: '继续编辑'
	}

	if(nodeId){
		//查询当前ID是否有值，，有则修改，没有则报错
		Nodes.findById(nodeId).then( (info) => {
			if(info){
				return Nodes.update({_id:nodeId},{nodeName: nodeName,nodeDesc: desc})
			}else{
				Promise.resolve();
			}
		}).then( (d) => {
			if(d){
				tipInfo.title = "保存成功";
				tipInfo.info = "保存成功";
				tipInfo.url = "/admin/nodeList";
				tipInfo.urlName = "返回列表";				
			}else{
				tipInfo.url= url+'?nodeId='+nodeId;
			}
			res.render('./admin/error.html',tipInfo);

		}).catch( (err) =>{
			console.log();
			res.end('500');
		})
	}else{
		Nodes.findOne({nodeName: nodeName}).then( (detail) =>{
			if(detail){
				exist = 'exist';
				Promise.resolve();
			}else{
				return new Nodes({nodeName: nodeName,nodeDesc: desc}).save();
			}
		}).then((d) => {
			if(exist){
				tipInfo.info = "栏目已存在";
			}else if(d){
				tipInfo.title = "保存成功";
				tipInfo.info = "保存成功";
				tipInfo.url = '/admin/nodeList',
				tipInfo.urlName = "返回列表";
			}
			res.render('./admin/success.html',tipInfo);

		}).catch((e) => {
			console.log(e);
			res.end('500');
		});
	}
})

//文章管理列表
router.get(/^(\/articlelist)+(\/(\w)+)?$/,(req,res) => {
	let artList = [];
	let nodeNames = {};
	let id = req.params[1] ? req.params[1].substr(1) : '';
	//console.log(id)
	let param = id ? {nodeId:id} : {};  //查询条件
	let count = 1;
	let limit = 10; 	//每页显示的条数
	let pages = 1;	//总页数据
	let page = 1;	//当前页
	let skip = 1;	//跳过的条数

	page = parseInt(req.query.page);

	//获取当前查询条件下的文章数
	Articles.count(param).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		//获取当前查询条件下文章列表
		return Articles.find(param).skip(skip).limit(limit).populate('nodeId');
	}).then( (lists) => {	//
		if(lists){
			//console.log(lists)

			lists.forEach((item)=>{
				item.updated = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
			});

			artList = lists;
			res.render('./admin/articles/articlelist.html',{
				title:"文章管理",
				artList: artList,
				"page": page,
				"pages": pages,
				"count": count
			})
		}else{
			Promise.reject();
		}
	},function(e){	//出错时执行
		res.render('./admin/articles/articlelist.html',{
			title:"文章管理",
			artList: artList,
			"page": page,
			"pages": pages,
			"count": count
		})
	});

	
});

//添加文章
router.get('/addArticle',(req,res) => {
	let nodeList = [];
	let artDetail = {};
	let tit = '添加文章';
	let btn ="添加";
	let artId = req.query.artId ? req.query.artId : '';
	Nodes.find({}).then(function(d){
		nodeList = d ? d : [];
		if(artId){
			return Articles.findById(artId).populate('nodeId');
		}else{
			Promise.resolve();
		}
	},function(e){
		res.render('./admin/articles/addarticle.html',{
			title: tit,
			btn: btn
		})
	}).then((detail) => {
		if(detail){
			artDetail = detail;
			artDetail.artNodeId = artDetail.nodeId.id;
		}
		if(artId) {
			tit = "编辑内容";
			btn = "保存"
		}
		res.render('./admin/articles/addarticle.html',{
			title: tit,
			nodeList: nodeList,
			artDetail: artDetail,
			btn: btn
		})
	});	
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
	//获取评论总数
	Comments.count({}).then((total) => {
		count = total;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		//获取评论列表
		return Comments.find({}).skip(skip).limit(limit).populate('articleId userId');

	}).then((d) => {
		d.forEach( (item) => {
			item['updated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
		});

		console.log(d);

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