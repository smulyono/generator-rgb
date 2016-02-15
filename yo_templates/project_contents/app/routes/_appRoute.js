define(function(require){
	"use strict";
	var Backbone = require("backbone"),
		$ = require("jquery"),
		<%=appName%>View = require("<%=appName%>");

	var <%= appName %>Route = Backbone.Router.extend({
		// === poor man solutions for view management ==
		currentView : undefined,
		loadView : function(newView, mainViewElement){
			if (this.currentView !== undefined){
				// clean up backbone model
				if (this.currentView.model){
					this.currentView.model.clear();
					delete this.currentView.model;
				}
				if (this.currentView.collection){
					this.currentView.collection.reset(null);
					delete this.currentView.collection;
				}
				this.currentView.remove();
			}
			this.currentView = newView;
			$(mainViewElement).html(this.currentView.render().el);
		},
		// ================================================// 
		routes : {
			"*any" : "appRoute"
		},
		initialize : function(){
			// initialize routes
		},
		appRoute : function(){
			this.loadView(new <%=appName%>View(), "#mainContainer");		
		}
	});

	new <%= appName %>Route();

	Backbone.history.start();
});
