$(function(){
	//添加用户
	$('#submitUser').click(function(){
		var userName = $("#userName").val();
		var password = $("#password").val();

		$.ajax({
			type: "post",
			url: "/api/user/register",
			dataType: "json",
			data: {
				userName: userName,
				password: password,
				repassword: password
			},
			success: function(d){
				if(d.sts == 1){
					window.location.reload();
				}else{
					alert(d.info);
				}
			}
		})

	});
	//删除用户
	$('#userList').on('click','.btn-del' ,function(){
		var id = $(this).attr("data-id");
		if(id){
			$.ajax({
				type: "post",
				url: "/api/user/del",
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
