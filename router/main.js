const express = require('express');
const moment = require('moment');

const router = express.Router();

//文章模型
const Articles = require('../module/articles');
//评论模型
const Comments = require('../module/comments');

//首页
router.get('/',(req,res,next) =>{
	//获取文章列表
	let artList = [];

	let count = 1;
	let limit = 10; 	//每页显示的条数
	let pages = 1;	//总页数据
	let page = 1;	//当前页
	let skip = 1;	//跳过的条数

	page = parseInt(req.query.page);

	Articles.count({}).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);

		page = page > 1 ? page > pages ? pages : page : 1;

		skip = (page - 1) * limit;

		Articles.find({}).skip(skip).limit(limit).then(function(aList){
			if(aList){
				//artList = aList;
				aList.forEach(function(item){
					//item['id'] = item['_id'].toString();
					item['upDated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
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



	Articles.count({"nodeId" : nodeId}).then(function(total){
		count = total;
		pages = Math.ceil(count / limit);

		page = page > 1 ? page > pages ? pages : page : 1;

		skip = (page - 1) * limit;

		Articles.find({"nodeId" : nodeId}).skip(skip).limit(limit).then(function(aList){
			if(aList){
				//artList = aList;
				aList.forEach(function(item){
					//item['id'] = item['_id'].toString();
					item['upDated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
					artList.push(item);
				});
			}

			if(req.navList){
				req.navList.forEach(function(item){
					if(item.id == nodeId){
						nodeName = item.nodeName;
					}
				})
			}


			res.render('./main/list.html',{
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
})

//内容详情
router.get('/detail/:id' ,(req,res) => {
	let ArtId = req.params.id;
	let detail = null
	let nodeList = '';
	let nodeName = ''

	Articles.findById(ArtId).then((d) => {
		 nodeList = req.navList;
		if(d){
			detail = d;
			detail['upDated'] = moment(detail['upDate']).format("YYYY-MM-DD HH:mm:ss");
		}
		nodeList.forEach((item) => {
			if(item.id == d.nodeId ){
				nodeName = item.nodeName;
			}
		});

		Comments.find({articleId : detail.id}).then(function(c){

			c.forEach((item) => {
				item['upDated'] = moment(item['upDate']).format("YYYY-MM-DD HH:mm:ss");
			});

			res.render('./main/detail.html',{
				"title": detail.title,
				"nodeName": nodeName,
				"nav" : nodeList,
				"userInfo": req.userInfo,
				"content" : detail,
				"commentList": c
			})		
		})

		
	})
});

module.exports = router;
