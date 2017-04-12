
$(function(){
	layui.use(['form', 'layedit', 'laydate'], function(){
		var form = layui.form()
		,layer = layui.layer
		,layedit = layui.layedit
		,laydate = layui.laydate;
		
		//创建一个编辑器
		var editIndex = layedit.build('LAY_demo_editor');
		
		//自定义验证规则
		form.verify({
			title: function(value){
				if(value.length < 5){
					return '标题至少得5个字符';
				}
			}
			,nodeId: function(value){
				if(value == ""){
					return '请所属分类';
				}
			}
			,content: function(value){
				layedit.sync(editIndex);
				if(value == ""){
					return '请填写文章内容';
				}
		    		    	
			}
		});
	  
	  	//监听提交
		form.on('submit(demo1)', function(data){
			$.ajax({
				type: "post",
				url: "/api/article/add",
				dataType: "json",
				data: data.field,
				success: function (db) {
					if(db.sts == 1){
						layer.msg(db.info, {icon: 1});
						setTimeout(function(){
							window.location.href = '/admin/articlelist';
						},1500);
					}else{
						layer.msg(db.info, {icon: 2});
					}
				}
			});
			return false;
		});
	});
});