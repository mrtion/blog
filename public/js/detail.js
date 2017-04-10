$(function(){
	$("#submitBtn").click(function(){
		var textObj = $("#commentCon");
		var con = textObj.val();
		var aId = textObj.attr('data-aId');
		var aTitle = textObj.attr('data-aTitle');
		var uId = textObj.attr('data-uId');
		var uName = textObj.attr('data-uName');

		$.ajax({
			type: 'post',
			url: '/api/comment/add',
			dataType: 'json',
			data: {
				articleId: aId,
				articleTitle: aTitle,
				userId: uId,
				userName: uName,
				content: con,
			},
			success: function(d){
				if(d && d.sts &&  d.sts == 1){
					var li = `<li><p>用户：${uName}</p><p>${con}</p><p>时间：${new Date()}</p></li>`;
					$(".comment-list ul").append(li);
					textObj.val('');
				}else{
					alert(d.info);
				}
			}
		})

	});
});