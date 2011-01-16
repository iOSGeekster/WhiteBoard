<%@ tag import="org.w3c.dom.*, javax.xml.parsers.*"%>
<html>
<%
DocumentBuilderFactory docFactory = 
  DocumentBuilderFactory.newInstance();
  DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
  Document doc = docBuilder.parse("http://localhost:8080/Taskboard/projects");
 %>
<ul id="divProjects">
<%  Element projects = doc.getDocumentElement();
	NodeList projectList = projects.getElementsByTagName("wb:project");
	if(projectList.getLength() == 0){
		%>No projects are defined<%
	}else{
	for(int i = 0; i < projectList.getLength(); i++){
		Node n = projectList.item(i);
		%>
		Title: <a href="/Taskboard/jsp/project.jsp?title=<%= n.getAttributes().getNamedItem("title").getNodeValue()  %>"><%= n.getAttributes().getNamedItem("title").getNodeValue() %></a>
		<input id="btnDelete" type="button" value="Delete" onclick="deleteProject('<%= n.getAttributes().getNamedItem("title").getNodeValue() %>')"/>
		<br/>
	<%}
	}
%>
</ul>
<br/>
</html>