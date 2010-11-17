<%@ page isErrorPage="true" %>
<html>
	<head><title>Error</title></head>
	<body>
		<h2>
			Oops!				
		</h2>
		Something unexpected happened!
		<br/>
		<%= exception.getMessage() %>
		<br/>
	</body>
</html>