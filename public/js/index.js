$(function(){
	//register
	$("#submit").click(function(){
		var userName = $("#userName").val();
		var password = $("#password").val();
		var repassword = $("#repassword").val();
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			dataType: 'json',
			data: {
				"userName" : userName,
				"password" : password,
				"repassword" : repassword
			},
			success: function(result){
				console.log(result);
			}
		})
	});
	//login
	$("#loginBtn").click(function(){
		var userName = $("#loginName").val();
		var password = $("#loginPassword").val();
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			dataType: 'json',
			data: {
				"userName" : userName,
				"password" : password
			},
			success: function(result){
				console.log(result);
				if(result.sts ==1){
					window.location.reload();
				}
			}
		})
	});

	//退出
	$("#loginout").click(function(){
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			dataType: 'json',
			success: function(result){
				if(result.sts == 0){
					window.location.reload();
				}
			}
		})
	});
});