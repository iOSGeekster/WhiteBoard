<html>
	<head>
		<title>My Test Page</title>
		<link rel="stylesheet" href="../css/jquery-ui-1.8.4.custom.css" type="text/css"></link> 
		<script type="text/javascript" src="../js/jquery-1.4.2.js"></script>
		<script src="../js/jquery-ui-1.8.4.custom.min.js"></script>
		<style type="text/css">
  			  #dragme { width: 100px; height: 70px; background: yellow;
  			  text-decoration:none;  
			  color:#000;  
			  background:#ffc;  
			  display:block;  
			  height:10em;  
			  width:10em;  
			  padding:1em;}
  			  #dialog {width:300px; height: 120px;}
  </style>
	</head>
	<body>
		<h1>My jQuery Test Page</h1>
		<script type="text/javascript">
		$(document).ready(function(){
			$("button").button();
			$("#dragme").draggable();
			$(dialog).dialog({autoOpen:false,title:'Add Task',
				resizable:false, modal:true, closeOnEscape:true,
				buttons:{"Ok":function(){$(this).dialog("close")}}
			});
			
		});
		</script>
		<button class="ui-button" onclick="$(dialog).dialog('open');return false;">Add task</button>
		<div id="dialog" style="display:none;">
			<input type="text" value="Enter task name">
		</div>
		<div id="dragme">Drag me</div>
	</body>
</html>