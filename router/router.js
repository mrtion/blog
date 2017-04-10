var index = function (req,res,next) {
	res.render('index.html',{"title":"首页"});
}

module.exports.index = index;