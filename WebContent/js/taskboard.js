$(window).load(function() {
	initialize();
});

function postNewProject(projectTitle){
	$.ajax({
		type: "POST",
		url: "/Whiteboard/projects/"+encodeURI(projectTitle),
		contentType	: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
		dataType	: 'xml',
		success: updatePage()
	});
}

function updatePage(){
	window.location.reload();
}

function getProject(name){
	$.ajax({
		type		: "GET",
		url			: "/Whiteboard/projects/"+encodeURI(name),
		contentType	: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
		dataType	: 'xml',
		success		: function(data){
			return data;
		}
	});
}

function deleteProject(projectName){
	$.ajax( {
		type : "DELETE",
		url : "/Whiteboard/projects/"+encodeURI(projectName),
		contentType	: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
		success: updatePage()
	});
}

function initialize(){
	$(document).ready(function(){
		$("#btnAddProject").button().click(function(){
			$('#dialog').dialog('open');
		});
		$("#updateList").button();
		$("#dialog").dialog({autoOpen:false,title:'Add Project',
			resizable:false, modal:true, closeOnEscape:true,
			buttons:{"Ok":function(){
				var newProjName = $("#projName").val();
				postNewProject(newProjName);
				$(this).dialog("close");
				},
				"Cancel":function(){
					$(this).dialog("close");
				}
			}
		});
	});
}
