/**
 * @module <%= appName %>
 * @author <%= author %> <<%=authorEmail %>>
 * @description <%=appDescription%>
 */
define(function(require){
    "use strict";

    var Backbone = require("backbone"),
    	$ = require("jquery"),
    	viewRawTemplate = require("text!<%=appName%>TemplatePath/<%=appName%>Template.html");

    // put some magic code here
    var <%= appName %>View = Backbone.View.extend({
    	initialize : function(){

    	},
    	render : function(){
    		var viewTemplate = _.template(viewRawTemplate);

    		$(this.el).html(viewTemplate());
    		
    		return this;
    	}
    });
    return <%= appName %>View;
})
