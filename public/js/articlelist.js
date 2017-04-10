$(function(){
	
	//删除用户
	$('#artList').on('click','.btn-del' ,function(){

		var id = $(this).attr("data-id");
		if(id){
			$.ajax({
				type: "post",
				url: "/api/article/del",
				dataType: 'json',
				data: {
					id : id
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
});