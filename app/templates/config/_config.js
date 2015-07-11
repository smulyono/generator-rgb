requirejs.config({
    paths : {
        // vendors
        "jquery" : "assets/js/vendor/jquery/jquery.min",
        "backbone" : "assets/js/vendor/backbone/backbone",
        "underscore" : "assets/js/vendor/underscore/underscore",
        "text" : "assets/js/vendor/requirejs-text/text",
        // app component
        "<%=appName%>" : "app/views/<%=appName%>View",
        "<%=appName%>Route" : "app/routes/<%=appName%>Route",
        "<%=appName%>TemplatePath" : "app/templates"
    }
});
