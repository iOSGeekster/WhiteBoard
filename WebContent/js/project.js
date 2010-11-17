var projectTitle; //The title of the project that is being showed
var moved; //A variable to hold the ID of the task being moved
var projectsXML; //The xml of project that is being showed
$(window).load(function() {
	
});

$(document).ready(function(){
	initializeDialog();
	projectTitle = $("#projectTitle").val();
	$.PeriodicalUpdater('/Whiteboard/projects/'+encodeURI(projectTitle), {
		method 		: 'get',
		minTimeout 	: 3000,
		maxTimeout 	: 3000,
		multiplier 	: 1,
		contentType	: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
		type 		: 'xml',
		maxCalls 	: 0,
		autoStop 	: 0
	},function(data){
			updateTaskList(data);
	});
});

function initializeDragMe(){
	$(".dragme").draggable({
		snap: ".dragme",
		revert: "invalid",
		start: function(event, ui){
			moved = $(this).attr("id");
		},
		stack: ".dragme"
	});
	$("td").droppable({
		drop: function(event, ui){
			updateTaskPos($(this).attr("id"));
		},
		tolerance: "intersect"
	});
};

function showMembers(){
	$("#divMembers").empty();
	var h3 = document.createElement("h3");
	h3.innerHTML = "Members";
	h3.setAttribute("class", "ui-widget-header ui-corner-all");
	$("#divMembers").append(h3);
	var members = projectsXML.getElementsByTagName("wb:member");
	if(members.length == 0){
		members = projectsXML.getElementsByTagName("member");//Trying without prefix in case browser likes this better
	}	
	if(members.length == 0){ //Checking again to make sure that there really are no members
		var p = document.createElement("p");
		p.innerHTML = "No members in project";
		$("#divMembers").append(p);
	}else{
		for(i = 0; i < members.length; i++){
			var member = members[i];
			var p = document.createElement("p");
			p.innerHTML = "Name: "+member.getAttribute("name")+" - Role: "+member.getAttribute("role");
			$("#divMembers").append(p);
		}
	}
	$("#divMembers").show("slide");
	$("#lnkShowMembers").attr("style", "display:none;");
	$("#lnkHideMembers").attr("style", "");
}

function hideMembers(){
	$("#divMembers").hide("slide");
	$("#lnkShowMembers").attr("style", "");
	$("#lnkHideMembers").attr("style", "display:none;");
}

function updateTaskPos(id){
	id = id+"";
	var taskElements = projectsXML.getElementsByTagName("wb:task"); //For Firefox
	if(taskElements.length == 0){ 
		taskElements = projectsXML.getElementsByTagName("task"); //For Chrome
	}
	for(i = 0; i < taskElements.length; i++){
		var taskElement = taskElements[i];
		if(taskElement.getAttribute("id") == moved){
			if(id == "colRdy"){
				taskElement.setAttribute("status", "1");
			}else if(id == "colProg"){
				taskElement.setAttribute("status", "2");
			}else if(id == "colCompl"){
				taskElement.setAttribute("status", "3");
			}else if(id == "colTest"){
				taskElement.setAttribute("status", "4");
			}else if(id == "colDepl"){
				taskElement.setAttribute("status", "5");
			}
		}
	}
	$.ajax({
		type: "PUT",
		url: "/Whiteboard/projects/"+encodeURI(projectTitle),
		data: projectsXML,
		processData : false,
		contentType	: 'text/xml',
		dataType	: 'xml',
		error       : function(xhr, ajaxOptions, thrownError){
						if(xhr.status == 400 || xhr.status == 500){
							alert("Error code: "+xhr.status+" Please try again");
							alert("Possible cause: "+ajaxOptions);
						}
					}
	});
};

function postNewTask(newTask){
	var xml = buildNewTask(newTask);
	$.ajax({
		type: "PUT",
		url: "/Whiteboard/projects/"+encodeURI(projectTitle),
		data: xml,
		processData : false,
		contentType	: 'text/xml',
		dataType	: 'xml'
	});
};

function buildNewTask(newTask){
	var elements = projectsXML.getElementsByTagName("wb:task").length;
	if(elements == 0){
		elements = projectsXML.getElementsByTagName("task").length;
	}
	newTaskElement = projectsXML.createElement("wb:task");
	newTaskElement.setAttribute("id", "task"+elements)
	newTaskElement.setAttribute("status", "1");
	newDescription = projectsXML.createElement("wb:description");
	description = projectsXML.createTextNode(newTask);
	newDescription.appendChild(description);
	newTaskElement.appendChild(newDescription);
	var tasks = projectsXML.getElementsByTagName("wb:tasks")[0]; //For Firefox
	if(!tasks){
		tasks = projectsXML.getElementsByTagName("tasks")[0]; //For Chrome
	}
	tasks.appendChild(newTaskElement);
	return projectsXML;
	
}

function putNewMember(memberName, memberRole){
	var xml = buildNewMember(memberName,memberRole);
	$.ajax({
		type: "PUT",
		url:  "/Whiteboard/projects/"+encodeURI(projectTitle),
		data: xml,
		processData: false,
		contentType: 'text/xml',
		dataType: 'xml'
	});
}

function buildNewMember(memberName, memberRole){
	newMemberElement = projectsXML.createElement("wb:member");
	newMemberElement.setAttribute("name", memberName);
	newMemberElement.setAttribute("role", memberRole);
	var members = projectsXML.getElementsByTagName("wb:members")[0]; //For Firefox
	if(!members){
		members = projectsXML.getElementsByTagName("members")[0]; //For Chrome
	}
	members.appendChild(newMemberElement);
	return projectsXML;
}

function updateTaskList(data){
	$("#colRdy").empty();
	$("#colProg").empty();
	$("#colCompl").empty();
	$("#colTest").empty();
	$("#colDepl").empty();
	projectsXML = data;
	var idInt = 0;
	$(data).find('[nodeName=wb:tasks]').each(function(){
		$(this).find('[nodeName=wb:task]').each(function(){
			var status = parseInt($(this).attr("status")); //Parsing as int, for the switch case
			$(this).find('[nodeName=wb:description]').each(function(){
				var description = $(this).text();
				var newDiv = document.createElement("div");
				newDiv.setAttribute("id", "task"+idInt++);
				newDiv.innerHTML = description;
				newDiv.setAttribute("class", "dragme");
				placeTaskInColumn(newDiv,status);
			});
		});
	});
	initializeDragMe();
};

function placeTaskInColumn(newDiv,status){
	switch(status){
	case 1:
		$("#colRdy").append(newDiv);
		$("#colRdy").append("<br/>");
		break;
	case 2:
		$("#colProg").append(newDiv);
		$("#colProg").append("<br/>");
		break;
	case 3:
		$("#colCompl").append(newDiv);
		$("#colCompl").append("<br/>");
		break;
	case 4:
		$("#colTest").append(newDiv);
		$("#colTest").append("<br/>");
		break;
	case 5:
		$("#colDepl").append(newDiv);
		$("#colDepl").append("<br/>");
		break;
	}
};


function initializeDialog(){
	$(document).ready(function(){
		$("#btnAddTask").button().click(function(){
			$('#dialog').dialog('open');
		});
		$("#btnAddMember").button().click(function(){
			$('#addMemDialog').dialog('open');
		});
		$("#dialog").dialog({autoOpen:false,title:'Add Task',
			resizable:false, modal:true, closeOnEscape:true,
			buttons:{"Ok":function(){
				var newTaskName = $("#taskName").val();
				postNewTask(newTaskName);
				$(this).dialog("close");
				},
				"Cancel":function(){
					$(this).dialog("close");
				}
			}
		});
		$("#addMemDialog").dialog({autoOpen:false,title:'Add Member',
			resizable:false, modal:true, closeOnEscape:true,
			buttons:{"Ok":function(){
				var memName = $("#memName").val();
				var memRole = $("#memRole").val();
				putNewMember(memName,memRole);
				$(this).dialog("close");
				},
				"Cancel":function(){
					$(this).dialog("close");
				}
			}
		});
	});
};