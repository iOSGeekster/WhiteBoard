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
	<script type="text/javascript" src="../js/taskboard.js"></script>
<title>WhiteBoard</title>
</head>
<body>
<h2 class="ui-widget-header ui-corner-all">Whiteboard - Select a project</h2>
<wb:projectList />
<button id="btnAddProject" class="ui-button">Add project</button>
<div id="dialog">
	<input id="projName" type="text" value="Enter project name" />
</div>
</body>

</html>