
$(function(){
	layui.use(['form', 'layedit', 'laydate'], function(){
		var form = layui.form()
		,layer = layui.layer
		,layedit = layui.layedit
		,laydate = layui.laydate;

		//自定义验证规则
		form.verify({
			nodeNames: function(value){
				if(value.length < 3){
					return '标题至少得3个字符';
				}
		    }
		});
		//监听提交
		form.on('submit(saveNode)', function(data){

		});
	});	
})
