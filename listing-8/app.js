//
// Adding a scale so that we can fit the visualization to the screen and use proper values from the data.
//
// NOTE: This is not the best way to use D3, just a stepping stone on our way to understanding D3.
//

function pointOnCircle (radius, angleDegrees) { // Helper function to create a point on the perimeter of a circle.
    var angleRadians = (angleDegrees * Math.PI) / 180;
    return {
        x: radius * Math.cos(angleRadians),
        y: radius * Math.sin(angleRadians)
    };
};

window.onload = function () {

    var width = window.innerWidth; // Dimensions for our visualization are derived from the size of the browser window.
    var height = window.innerHeight;

    var earthRadius = 6371; // This is the real radius of the earth!

    var maxOrbitRadius = d3.max(data.map(x => earthRadius + x.PERIGEE)); // Determine the maximum orbit distance from the earth.

    var radiusScale = d3.scaleLinear() // Create a scale for the radius.
        .domain([0, maxOrbitRadius])
        .range([0, Math.min(height/2, width/2)]);
    
    var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
        .attr("width", width) // Set the width and height of the elemnt.
        .attr("height", height);

    svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
        .attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
        .attr("transform", "translate(" + (width/2) + ", " + (height/2) + ")") // Position the circle in the middle of the visualization.
        .attr("r", radiusScale(earthRadius)); // Set the radius the earth.

    for (var rowIndex = 0; rowIndex < data.length; ++rowIndex) { // Manually loop our data and add it to the visualization.
        var row = data[rowIndex];
        svgElement.append("g") // Adding a group. This means we can have multiple sub-elements to comprise the visuals for a piece of space junk.
            .attr("class", "junk") // Set CSS clas so we can style our space junk.
            .attr("transform", function () { // Set the transform element to position the space junk in orbit around the 'earth'.
                var orbitRadius = radiusScale(earthRadius + row.PERIGEE); // The distance from the center of the earth that the space junk is orbiting.
                var point = pointOnCircle(orbitRadius, Math.random() * 360); // Choose a random position in orbit that is relative to the earth.
                var x = (width/2) + point.x; // Translate the space junk coordinates into visualization-relative coordinates.
                var y = (height/2) + point.y;
                return "translate(" + x + ", " + y + ")" ; // Synthesize an SVG 'transform' attribute.
            })
            .append("circle") // Add a circle to represent the space junk.
                .attr("r", 5); // Hard-coded circle radius.
    }
};

var data = [
    {
        "OBJECT_NAME": "NOAA 16 DEB",
        "PERIGEE": 849,
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "PERIGEE": 778,
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "PERIGEE": 812,
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "PERIGEE": 848,
      }
];