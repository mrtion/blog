$(function(){
	//添加栏目
	$('#submitNode').click(function(){
		var nodeName = $("#nodeName").val();
		var nodeDesc = $("#nodeDesc").val();
		if(nodeName && nodeDesc){
			$.ajax({
				type: "post",
				url: "/api/node/add",
				dataType: 'json',
				data: {
					nodeName : nodeName,
					nodeDesc : nodeDesc
				},
				success: function(d){
					if(d && d.sts &&  d.sts == 1){
						window.location.reload();
					}else{
						alert(d.info);
					}
				}
			})
		}
	});
	//删除栏目
	$("#nodeList").on("click",".btn-del",function(){
		var id = $(this).attr("data-id");

		if(id){
			$.ajax({
				type: "post",
				url: "/api/node/del",
				dataType: "json",
				data: {
					id: id
				},
				success: function(d){
					if(d.sts == 1){
						window.location.reload();
					}else{
						alert(d.info);
					}
				}
			})
		}
	});
});