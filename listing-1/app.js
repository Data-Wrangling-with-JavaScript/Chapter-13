//
// Shows the most basic use of D3 to put a simple visual on screen in the browser.
//

"use strict";


window.onload = function () {

    const visualizationWidth = window.innerWidth; // Dimensions for our visualization are derived from the size of the browser window.
    const visualizationHeight = window.innerHeight;

    var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
        .attr("width", visualizationWidth) // Set the width and height of the elemnt.
        .attr("height", visualizationHeight);

    var earthRadius = 50; // Set the radius of the earth to 50 pixels.

    svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
        .attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
        .attr("transform", "translate(" + (visualizationWidth/2) + ", " + (visualizationHeight/2) + ")") // Position the circle in the middle of the visualization.
        .attr("r", earthRadius); // Set the radius the earth.
};