//
// Shows the most basic use of D3 to put a simple visual on screen in the browser.
//

"use strict";


window.onload = function () {

    var width = window.innerWidth; // Dimensions for our visualization are derived from the size of the browser window.
    var height = window.innerHeight;

    var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
        .attr("width", width) // Set the width and height of the element.
        .attr("height", height);

    var earthRadius = 50; // Set the radius of the earth to 50 pixels.
    var earthTranslation = "translate(" + (width/2) + ", " + (height/2) + ")"; // Setup a translation to position the earth.

    var theEarth = svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
    theEarth.attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
        .attr("transform", earthTranslation) // Position the circle in the middle of the visualization.
        .attr("r", earthRadius); // Set the radius the earth.
};