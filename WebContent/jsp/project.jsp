<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" errorPage="errorPage.jsp"%>
<%@ taglib prefix="wb" tagdir="/WEB-INF/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" href="../css/jquery-ui-1.8.4.custom.css" type="text/css" />
	<link rel="stylesheet" href="../css/taskboard.css" type="text/css" />
	<script type="text/javascript" src="../js/jquery-1.4.2.js"></script>
	<script type="text/javascript" src="../js/jquery-ui-1.8.4.custom.min.js"></script>
	<script type="text/javascript" src="../js/jquery.periodicalupdater.js"></script>
	<script type="text/javascript" src="../js/project.js"></script>
<title>Taskboard - Project</title>
</head>
<body>
<input id="projectTitle" type="hidden" value="<%=request.getParameter("title") %>">
<h2 class="ui-widget-header ui-corner-all">Tasks in project - <%=request.getParameter("title") %></h2>
<wb:taskTable />
<br/>
<a id="lnkShowMembers" href="#" onclick="showMembers();">Show members</a>
<a id="lnkHideMembers" href="#" onclick="hideMembers();" style="display:none;">Hide members</a>
<br />

<div id="divMembers" class="ui-widget-content ui-corner-all">
</div>

<br/>
<button id="btnAddTask" class="ui-button">Add Task</button>
<div id="dialog">
	<input id="taskName" type="text" value="Enter task name" />
</div>
<br />
<button id="btnAddMember" class="ui-button">Add member</button>
<div id="addMemDialog">
	<input id="memName" type="text" value="Member name" />
	<select id="memRole">
		<option value="">Select role</option>
		<option value="developer">Developer</option>
		<option value="architect">Architect</option>
		<option value="consultant">Consultant</option>
	</select>
</div>
<br/>
<a href="taskboard.jsp">Back to projects</a>
</body>
</html>