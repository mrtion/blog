const express = require('express');
const moment = require('moment');

const router = express.Router();

//文章模型
const Articles = require('../model/articles');
//评论模型
const Comments = require('../model/comments');

//首页
router.get('/',(req,res,next) =>{
	//获取文章列表
	let artList = [];
	let cList = [];
	let count = 1;
	let limit = 10; 	//每页显示的条数
	let pages = 1;	//总页数据
	let page = 1;	//当前页
	let skip = 1;	//跳过的条数

	page = parseInt(req.query.page);
	//统计文章数
	Articles.count({}).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		//获取所有评论
		return Comments.find({});
	}).then( (comm) => {
		if(comm){
			cList = comm;
			return Articles.find({}).sort({_id: -1}).skip(skip).limit(limit);
		}else{
			Promise.resolved();
		}
	}).then(function(aList){
		if(aList){
			aList.forEach(function(item){
				item['upDated'] = moment(item['upDate']).format("MM月DD日，YYYY");				
				//统计评论数
				item['commentCount'] = cList.filter( (v) => {return v.articleId == item.id;}).length;
				artList.push(item);
			});
		}
		res.render('./main/index.html',{
			"title":"首页",
			"userInfo" :req.userInfo,
			"nav" : req.navList,
			"artList" : artList,
			"page": page,
			"pages": pages,
			"count": count
		});
	})
})

//栏目列表页
router.get('/list/:id',(req,res) => {
	//获取文章列表
	let artList = [];
	let nodeId =  req.params.id;
	let nodeName = '';
	let path = req.path;
	let count = 1;
	let limit = 10; 	//每页显示的条数
	let pages = 1;	//总页数据
	let page = 1;	//当前页
	let skip = 1;	//跳过的条数
	page = parseInt(req.query.page);
	//统计文章数
	Articles.count({"nodeId": nodeId}).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);
		page = page > 1 ? page > pages ? pages : page : 1;
		skip = (page - 1) * limit;
		//获取所有评论
		return Comments.find({});
	}).then( (comm) => {
		if(comm){
			cList = comm;
			return Articles.find({"nodeId" : nodeId}).sort({_id: -1}).skip(skip).limit(limit).populate('nodeId');
		}else{
			Promise.resolved();
		}
	}).then(function(aList){
		if(aList){
			aList.forEach(function(item){
				nodeName = nodeName || item.nodeId.nodeName;
				item['upDated'] = moment(item['upDate']).format("MM月DD日，YYYY年");				
				//统计评论数
				item['commentCount'] = cList.filter( (v) => {return v.articleId == item.id;}).length;
				artList.push(item);
			});
		}

		res.render('./main/index.html',{
			"title": nodeName,
			"userInfo": req.userInfo,
			"nav" : req.navList,
			"artList" : artList,
			"url": path,
			"page": page,
			"pages": pages,
			"count": count,
			"limit": limit
		});
	})

})

//内容详情
router.get('/detail/:id' ,(req,res) => {
	let ArtId = req.params.id;
	let detail = null
	let nodeList = '';
	let nodeName = ''
	Articles.findById(ArtId).populate('nodeId').then((d) => {
		nodeList = req.navList;
		if(d){
			detail = d;
			detail['updated'] = moment(detail['upDate']).format("MM月DD日，YYYY年");
			detail['updated2'] = moment(detail['upDate']).format("YYYY-MM-DD HH:mm:ss");
		}
		Comments.find({articleId : detail.id}).sort({_id: -1}).then(function(c){
			c.forEach((item) => {
				item['updated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
			});
			res.render('./main/detail.html',{
				"title": detail.title,
				"nav" : nodeList,
				"userInfo": req.userInfo,
				"content" : detail,
				"commentList": c
			})		
		})
	})
});

module.exports = router;
