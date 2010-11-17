package dk.ares;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Namespace;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

public class WebService extends HttpServlet {

	private static final String CONTEXT_SPECIFIC_PROJECT = "/projects/";
	private static final String PROJECTS_XML = "projects.xml";
	private static final String CONTEXT_PROJECTS = "/projects";
	private static final Namespace NAMESPACE = Namespace.getNamespace("wb", "http://www.ares.dk/whiteboard");
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Override
	protected synchronized void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/xml");
		String contextPath = getServletContext().getContextPath();
		File data = new File(PROJECTS_XML);
		data.getAbsolutePath();
		if(!data.exists()){
			data.createNewFile();
			initializeFile(data);
		}
		if((contextPath+CONTEXT_PROJECTS).equalsIgnoreCase(request.getRequestURI())){
			try {
				Document d = new SAXBuilder().build(data);
				new XMLOutputter().output(d, response.getOutputStream());
			} catch (JDOMException e) {
				e.printStackTrace();
			}
		}else if((request.getRequestURI()).startsWith(contextPath+CONTEXT_SPECIFIC_PROJECT)){
			try {
				Document document = new SAXBuilder().build(data);
				Document returnDoc = null;
				List<Element> children = document.getRootElement().getChildren();
				for(Element e : children){
					String elementTitle = URLDecoder.decode(request.getRequestURI().split("/projects/")[1]);
					if(e.getAttribute("title").getValue().equals(elementTitle)){
						returnDoc = new Document((Element)e.clone());
					}
				}
				if(returnDoc != null){
					new XMLOutputter(Format.getPrettyFormat()).output(returnDoc, response.getOutputStream());
				}
				
			} catch (JDOMException e) {
				response.sendError(response.SC_INTERNAL_SERVER_ERROR, "Could not parse server XML");
			}
		}
	}
	
	private void initializeFile(File data) {
		Document d = new Document();
		Element projects = new Element("projects", NAMESPACE);
		d.setRootElement(projects);
		try {
			new XMLOutputter(Format.getPrettyFormat()).output(d, new FileOutputStream(data));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected synchronized void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Document updatedProject = null;
		Document existingProjects = null;
		File data = new File(PROJECTS_XML);
		if(!data.exists()){
			data.createNewFile();
		}
		SAXBuilder builder = new SAXBuilder();
		try {
			updatedProject = builder.build(request.getInputStream());
		} catch (JDOMException e) {
			response.sendError(response.SC_BAD_REQUEST, "Could not parse incoming XML");
			e.printStackTrace();
			return;
			
		}
		try {
			existingProjects = builder.build(data);
		} catch (JDOMException e) {
			response.sendError(response.SC_INTERNAL_SERVER_ERROR, "Could not parse server XML");
			return;
		}
		String projectTitle = URLDecoder.decode(request.getRequestURI().split("/projects/")[1]);
		Element projects = existingProjects.getRootElement();
		List<Element> children = projects.getChildren();
		for(Element project:children){
			if(project.getAttribute("title").getValue().equalsIgnoreCase(projectTitle)){
				int index = children.indexOf(project);
				projects.removeContent(project);
				projects.addContent(index, (Element)updatedProject.getRootElement().clone());
				break;
			}
		}
		new XMLOutputter(Format.getPrettyFormat()).output(existingProjects, new FileOutputStream(data));
	}
	
	@Override
	protected synchronized void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		File data = new File(PROJECTS_XML);
		if(!data.exists()){
			data.createNewFile();
		}
		Document document = null;
		try {
			document = new SAXBuilder().build(data);
		} catch (JDOMException e) {
			e.printStackTrace();
		}
		String projectTitle = URLDecoder.decode(request.getRequestURI().split("/projects/")[1]);
		Element projects = document.getRootElement();
		Element newProject = createNewProjectElement();
		newProject.setAttribute("title", projectTitle);
		projects.addContent(newProject);
		new XMLOutputter(Format.getPrettyFormat()).output(document, new FileOutputStream(data));
	}
	
	@Override
	protected synchronized void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		File data = new File(PROJECTS_XML);
		String projectTitle = URLDecoder.decode(request.getRequestURI().split("/projects/")[1]);
		Document document = null;
		try {
			document = new SAXBuilder().build(data);
		} catch (JDOMException e) {
			e.printStackTrace();
		}
		Element projects = document.getRootElement();
		List<Element> children = projects.getChildren();
		Element elementToDelete = null;
		for (Iterator<Element> childrenElements = children.iterator(); childrenElements.hasNext();) {
			Element project = (Element) childrenElements.next();
			if(project.getAttribute("title").getValue().equalsIgnoreCase(projectTitle)){
				elementToDelete = project;
			}
		}
		if(elementToDelete != null){
			elementToDelete.getParent().removeContent(elementToDelete);
		}
		new XMLOutputter(Format.getPrettyFormat()).output(document, new FileOutputStream(data));
	}
	
	private Element createNewProjectElement(){
		Element newProject = new Element("project", NAMESPACE);
		Element members = new Element("members", NAMESPACE);
		newProject.addContent(members);
		Element tasks = new Element("tasks", NAMESPACE);
		newProject.addContent(tasks);
		return newProject;
	}
}
