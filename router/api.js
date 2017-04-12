const express = require('express');
const router = express.Router();
//用户模型
const User = require('../model/users');
//栏目模型
const Nodes = require('../model/nodes');
//文章模型
const Articles = require('../model/articles');
//评论模型
const Comments = require('../model/comments');

let resData;

router.use(function(req,res,next){
	resData = {
		sts:1,
		info:''
	}
	next()
});


//注册接口
router.post('/user/register',(req,res,next) =>{
	
	let userName = req.body.userName;
	let password = req.body.password;
	let repassword = req.body.repassword;
	let userType = req.body.userType ? req.body.userType : "0";

	if(userName == ''){
		resData.sts = 0;
		resData.info = '用户名不能为空';
		res.status(200).json(resData)
		return ;
	}else if(password == ''){
		resData.sts = 0;
		resData.info = '密码不能为空';
		res.status(200).json(resData)
		return ;
	}else if(repassword == ''){
		resData.sts = 0;
		resData.info = '重复密码不能为空';
		res.status(200).json(resData)
		return ;
	}else if(repassword != password){
		resData.sts = 0;
		resData.info = '两次输入的密码不一致';
		res.status(200).json(resData)
		return ;
	}else{
		//判断当前用户是否被注册
		User.findOne({"userName": userName },function(e,d){
			//res.status(200).json(resData)
			if(d){
				resData.sts = 0;
				resData.info = '用户名已存在';
				res.status(200).json(resData)
			}else{
				new User({
					"userName" : userName,
					"password" : password,
					"userType" : userType
				}).save(function(e){
					if(e){
						resData.sts = 0;
						resData.info = '保存失败，请稍后再试';
						res.status(404).json(resData)
					}else{
						resData.sts = 1;
						resData.info = '注册成功';
						res.status(200).json(resData)
					}
				});
			}

		});	
	}
})

//登录
router.post('/user/login',function(req,res,next){
	let userName = req.body.userName;
	let password = req.body.password;
	let userInfo = {}

	//查找用户是否存在
	User.findOne({
		"userName" : userName,
		"password" : password
	}).then((d) => {
		console.log(d);
		if(d){
			resData.sts = 1;
			resData.info = '登录成功';

			userInfo.userName = d.userName;
			userInfo.id = d._id;
			resData.userInfo = userInfo;
			req.cookie.set('userInfo',JSON.stringify(userInfo))
			res.status(200).json(resData);
		}else{
			resData.sts = 0;
			resData.info = '用户名或密码不对';
			res.status(200).json(resData)
		}
	});

})

//退出
router.get('/user/logout',(req,res) => {

	req.cookie.set('userInfo',null)
	resData.sts = 0;
	resData.info = '退出成功';
	res.status(200).json(resData)
})

//根据ID删除用户名
router.post('/user/del',function(req,res){
	let id = req.body.id;
	//let cId = req.body.userId;
	User.findByIdAndRemove(id).then(function(d){
		if(d){
			resData.sts = 1;
			resData.info = '删除成功';
		}else{
			resData.sts = 0;
			resData.info = '删除失败';
		}
		res.status(200).json(resData);
	},function(e){
		console.log(e)
		resData.sts = 0;
		resData.info = '删除失败';
		res.status(200).json(resData);
	});
	
});

//添加栏目
router.post("/node/add",(req,res) => {
	let nodeName = req.body.nodeName;
	let nodeDesc = req.body.nodeDesc;
	Nodes.findOne({nodeName: nodeName}).then(function(d){
		if(d){
			resData.sts = 0;
			resData.info = '栏目已存在';
			res.status(200).json(resData);
		}else{
			new Nodes({
				nodeName: nodeName,
				nodeDesc: nodeDesc,
				nodeType: '0'
			}).save(function(e){
				if(e){
					resData.sts = 0;
					resData.info = '保存失败，请稍后再试';
					res.status(404).json(resData)
				}else{
					resData.sts = 1;
					resData.info = '添加成功';
					res.status(200).json(resData)
				}
			})
		}
	},function(e){
		resData.sts = 0;
		resData.info = '保存失败，请稍后再试';
		res.status(404).json(resData)
	})
});

//删除栏目
router.post("/node/del",(req,res) => {
	let id = req.body.id;
	Nodes.findByIdAndRemove(id).then(function(d){
		if(d){
			resData.sts = 1;
			resData.info = '删除成功';
		}else{
			resData.sts = 0;
			resData.info = '删除失败';
		}
		res.status(200).json(resData);
	},function(e){
		resData.sts = 0;
		resData.info = '删除失败';
		res.status(200).json(resData);
	})

});

/*
*  	添加或编辑文章
*	当aId 存在时为编辑,否则来新增
*/
router.post('/article/add',(req,res) => {
	let aId = req.body.aId ? req.body.aId : '';
	let subData = {
			nodeId: req.body.nodeId,
			title: req.body.title,
			author: req.body.author,
			desc: req.body.desc,
			source: req.body.source,
			content: req.body.content,
			upDate: new Date()
		};
	//
	if(!aId){
		new Articles(subData).save(function(e){
			if(e){
				resData.sts = 0;
				resData.info = '添加失败';
			}else{
				resData.sts = 1;
				resData.info = '添加成功';
			}
			res.status(200).json(resData);
		});
	}else{
		Articles.update({_id: aId},subData,(e) =>{
			if(e){
				resData.sts = 0;
				resData.info = '编辑失败';
			}else{
				resData.sts = 1;
				resData.info = '编辑成功';
			}
			res.status(200).json(resData);
		});
	}
});

//删除文章
router.post("/article/del",(req,res) => {
	let id = req.body.id;
	Articles.findByIdAndRemove(id).then(function(d){
		if(d){
			resData.sts = 1;
			resData.info = '删除成功';
		}else{
			resData.sts = 0;
			resData.info = '删除失败';
		}
		res.status(200).json(resData);
	},function(e){
		resData.sts = 0;
		resData.info = '删除失败';
		res.status(200).json(resData);
	})

});

//添加评论
router.post("/comment/add",(req,res) => {
	
	let articleId = req.body.articleId;	//文章ID
	let articleTitle = req.body.articleTitle;	//文章标题
	let userId = req.body.userId;		//评论用户ID
	let userName = req.body.userName;	//评论用户名
	let content = req.body.content;	//评论内容
	let upDate = Date.now();	//更新时间

	new Comments({
		articleId: articleId,
		articleTitle: articleTitle,
		userId: userId,
		userName: userName,
		content: content,
		upDate: upDate
	}).save( (e) => {
		if(e){
			resData.sts = 0;
			resData.info = '添加失败，请稍后再试';
			res.status(404).json(resData)
		}else{
			resData.sts = 1;
			resData.info = '添加成功';
			res.status(200).json(resData)
		}
	})
})
//删除评论
// param {cId} 
// cId :评论Id
router.post('/comment/del',(req,res) =>{
	let cId = req.body.cId;

	Comments.findByIdAndRemove({_id: cId},(err) => {
		if(err){
			resData.sts = 0;
			resData.info = '删除失败，请稍后再试';
			res.status(404).json(resData)
		}else{
			resData.sts = 1;
			resData.info = '删除成功';
			res.status(200).json(resData)
		}
	});

});

module.exports = router;
