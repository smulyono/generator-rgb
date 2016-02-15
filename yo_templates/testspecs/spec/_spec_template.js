/**
 * Unit test for <%=moduleName%>
 *
 * Jasmine-jquery docs https://github.com/velesin/jasmine-jquery
 * Jasmine docs http://jasmine.github.io/2.0/introduction.html
 */
define(function(require){
    var $ = require("jquery"),
        <%=moduleName%>var = require("<%=moduleName%>");
    // Activating jasmine jquery
    require("jasmine-jquery");

	describe("<%=moduleName%> Test Suite", function(){
		// prepare Fixture elements
		var fixtureURL;

		beforeEach(function(){
			$.ajaxSetup({cache:true, async:false});

			// -- setting up jasmine fixtures --
			// jasmine.getFixtures().fixturesPath = getRootDir();
			// fixtureURL = "path/to/template";
			// -- load the fixtures --
			// loadFixtures(fixtureURL);

			// Setting up Ajax interceptor, fixtures must be loaded
			// first before any ajax interceptor
			// -- initialize --
			// jasmine.Ajax.install();
			// -- Example on creating stub
			// jasmine.Ajax
			// 		.stubRequest("url")
			// 		.andReturn({
			// 			"status" : 200,
			// 			"contentType" : "application/json",
			// 			"responseText" : JSON.stringify({
			// 				"name" : "new"
			// 			})
			// 		})
            //
            // Setting up timeout functions
            // jasmine.clock().install();
		});
        afterEach(function() {
            // -- closing
            // jasmine.Ajax.uninstall();
            // -- reset clock functions
            // jasmine.clock().uninstall();
        });

		it("should test for loading module", function(){
            // expect($("body")).toBeInDOM();
            expect(<%=moduleName%>var).not.toBeUndefined();
		});
	});
});
