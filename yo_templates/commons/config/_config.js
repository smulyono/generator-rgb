requirejs.config({
    paths : {
        // vendors
        "jquery" : "assets/js/vendor/jquery/jquery.min",
        "backbone" : "assets/js/vendor/backbone/backbone",
        "underscore" : "assets/js/vendor/underscore/underscore",
        "text" : "assets/js/vendor/requirejs-text/text",
        "jasmine" : "assets/js/vendor/jasmine/jasmine",
        "jasmine-jquery" : "assets/js/vendor/jasmine-jquery/jasmine-jquery",
        <% if (generatorType == 'site') { %>
        // app modules
        "<%=appName%>" : "app/views/<%=appName%>View",
        "<%=appName%>Route" : "app/routes/<%=appName%>Route",
        "<%=appName%>TemplatePath" : "app/templates"<% } %>
        // component modules
        <% if (generatorType == 'component') { %>
        "<%=appName%>" : "src/<%=appName%>" <% } %>
    }
});
