$(function(){
	layui.use(['form', 'layedit', 'laydate'],function(){
		var layer = layui.layer;
		//删除评论
		$('#commList').on('click','.btn-del' ,function(){
			var _this = $(this);
			var id = _this.attr("data-id");
			if(id){
				$.ajax({
					type: "post",
					url: "/api/comment/del",
					dataType: 'json',
					data: {
						cId : id
					},
					success: function(d){
						if(d && d.sts &&  d.sts == 1){
							layer.msg(d.info, {icon: 1});
							_this.parents('tr').remove();
						}else{
							alert(d.info);
						}
					}
				})
			}
		});
	});
});
