$(function(){
	var temp = '';
	var loginDilog = '<form class="layui-form">'+
			'<h3 class="layui-form-tit">登录</h3>'+
			'<div class="layui-form-item">'+
		    '<div class="layui-inline">'+
		      	'<label class="layui-form-label">用户名</label>'+
		      	'<div class="layui-input-inline">'+
		        	'<input type="text" name="userName" placeholder="输入用户名" lay-verify="userName" autocomplete="off" class="layui-input">'+
		      	'</div>'+
		    '</div>'+
  		'</div>'+
  		'<div class="layui-form-item">'+
		    '<div class="layui-inline">'+
		      	'<label class="layui-form-label">密码</label>'+
		      	'<div class="layui-input-inline">'+
		        	'<input type="password" name="password" placeholder="输入密码" lay-verify="password" autocomplete="off" class="layui-input">'+
		      	'</div>'+
		    '</div>'+
  		'</div>'+
  		'<div class="layui-form-item">'+
  			'<div class="layui-input-block register">'+
		      	'<button type="button" class="layui-btn" lay-submit="" lay-filter="demo1">登录</button>'+
		      	'<a class="reset registerBtn" href="javascript:;" id="">立即注册</a>'
		    '</div>'+
  		'</div>'+
	'</form>';
	var regDilog = '<form class="layui-form">'+
			'<h3 class="layui-form-tit">登录</h3>'+
			'<div class="layui-form-item">'+
		    '<div class="layui-inline">'+
		      	'<label class="layui-form-label">用户名</label>'+
		      	'<div class="layui-input-inline">'+
		        	'<input type="text" name="userName" placeholder="输入用户名" lay-verify="userName" autocomplete="off" class="layui-input">'+
		      	'</div>'+
		    '</div>'+
  		'</div>'+
  		'<div class="layui-form-item">'+
		    '<div class="layui-inline">'+
		      	'<label class="layui-form-label">密码</label>'+
		      	'<div class="layui-input-inline">'+
		        	'<input type="password" name="password" placeholder="输入密码" lay-verify="password" autocomplete="off" class="layui-input">'+
		      	'</div>'+
		    '</div>'+
  		'</div>'+
  		'<div class="layui-form-item">'+
		    '<div class="layui-inline">'+
		      	'<label class="layui-form-label">重复密码</label>'+
		      	'<div class="layui-input-inline">'+
		        	'<input type="password" name="repassword" placeholder="输入重复密码" lay-verify="repassword" autocomplete="off" class="layui-input">'+
		      	'</div>'+
		    '</div>'+
  		'</div>'+
  		'<div class="layui-form-item">'+
  			'<div class="layui-input-block register">'+
		      	'<button type="button" class="layui-btn" lay-submit="" lay-filter="demo1">注册</button>'+
		      	'<a class="reset loginBtn" href="javascript:;" id="">去登录</a>'
		    '</div>'+
  		'</div>'+
	'</form>';
	layui.use(['form','layer'], function(){
	  	var layer = layui.layer,
	  		form = layui.form(),
	  		flag,
	  		layIndex;

	  	// loginBtn
		$("body").on('click','.loginBtn',function(){
			flag = 'login';
			layer.close(layIndex);
			layIndex = layer.open({
				type: 1,
				title: false,
				closeBtn: 0,
				shadeClose: true,
				skin: 'yourclass',
			 	content: loginDilog
			});
		});
		// registerBtn
		$("body").on('click','.registerBtn',function(){
			flag = 'register';
			layer.close(layIndex);
			layIndex = layer.open({
				type: 1,
				title: false,
				closeBtn: 0,
				shadeClose: true,
				skin: 'yourclass',
			 	content: regDilog
			});
		});

		//自定义验证规则
		form.verify({
			userName: function(value){
				if(value.length < 3){
					return '标题至少得3个字符';
				}
			}
			,password: function(value){
				if(value == ""){
					return '密码不能为空';
				}
			}
			,repassword: function(value){
				if(value == ""){
					return '密码不能为空';
				}
				if(value != $("input[name='password']").val()){
					return '两次密码不一致';
				}
		    		    	
			}
		});
	  
	  	//监听提交
		form.on('submit(demo1)', function(data){
			var url = '';
			if(flag == "login"){
				url = '/api/user/login';
			}
			if(flag == "register"){
				url = '/api/user/register';
			}
			if(flag){
				$.ajax({
					type: "post",
					url: url,
					dataType: "json",
					data: data.field,
					success: function (db) {
						if(db.sts == 1){
							layer.close(layIndex);
							layer.msg(db.info, {icon: 1});
							if(db.userInfo){
								$("#uName").text(db.userInfo.userName);
								$('.fast-tools').hide();
								$('.rester-box,.in-item').show();
								detailLogin && detailLogin(db.userInfo);
							}
						}else{
							layer.msg(db.info, {icon: 2});
						}
					}
				});
			}
			return false;
		});

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