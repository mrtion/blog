$(function(){
	$("#submitBtn").click(function(){
		var textObj = $("#commentCon");
		var cNubObj = $("#commNun");
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
					cNubObj.text( parseInt(cNubObj.text())+1 );

					var li = `<li class="clearfix"><div class="avatar fl"><img src="/public/images/avatar.jpg" /></div><div class="comment-com"><span class="user">${d.detail.userName}</span><span class="time">时间：${d.detail.upDate}</span><p class="con">${d.detail.content}</p></div></li>`;
					$("#commentList li").eq(0).before(li);
					textObj.val('');
				}else{
					alert(d.info);
				}
			}
		})

	});
});