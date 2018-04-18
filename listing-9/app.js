//
// Now using a D3 data join to add our data to the visualization.
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
    var earthPosition = "translate(" + (width/2) + ", " + (height/2) + ")"; // Setup a translation to position the earth.
    var maxOrbitRadius = d3.max(data.map(x => earthRadius + x.PERIGEE)); // Determine the maximum orbit distance from the earth.

    var radiusScale = d3.scaleLinear() // Create a scale for the radius.
        .domain([0, maxOrbitRadius])
        .range([0, Math.min(height/2, width/2)]);
    
    var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
        .attr("width", width) // Set the width and height of the elemnt.
        .attr("height", height);

    var theEarth = svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
    theEarth.attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
        .attr("transform", earthPosition) // Position the circle in the middle of the visualization.
        .attr("r", earthRadius); // Set the radius the earth.

    var spaceJunk = svgElement.selectAll("g") // Select all g elements.
        .data(data) // 'Join' our data to the selection.
    spaceJunk.enter() // Specify what happens for each incoming data point.
            .append("g") // Append a group element for each data point.
            .attr("class", "junk") // Set CSS clas so we can style our space junk.
            .attr("transform", function(row, index) { // Set the transform element to position the space junk in orbit around the 'earth'.
                var orbitRadius = radiusScale(earthRadius + row.PERIGEE); // The distance from the center of the earth that the space junk is orbiting.
                var point = pointOnCircle(orbitRadius, Math.random() * 360); // Choose a random position in orbit that is relative to the earth.
                var x = (width/2) + point.x; // Translate the space junk coordinates into visualization-relative coordinates.
                var y = (height/2) + point.y;
                return "translate(" + x + ", " + y + ")" ; // Synthesize an SVG 'transform' attribute.
            })
            .append("circle") // Add a circle to represent the space junk.
                .attr("r", 5); // Hard-coded circle radius.
};

var data = [
    {
        "OBJECT_NAME": "NOAA 16 DEB",
        "COUNTRY": "US",
        "PERIOD": 102.55,
        "INCLINATION": 98.9,
        "APOGEE": 910,
        "PERIGEE": 849,
        "RCS_SIZE": "SMALL",
        "LAUNCH": "21/09/2000"
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "COUNTRY": "US",
        "PERIOD": 101.31,
        "INCLINATION": 98.98,
        "APOGEE": 864,
        "PERIGEE": 778,
        "RCS_SIZE": "SMALL",
        "LAUNCH": "21/09/2000"
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "COUNTRY": "US",
        "PERIOD": 102.04,
        "INCLINATION": 98.86,
        "APOGEE": 898,
        "PERIGEE": 812,
        "RCS_SIZE": "SMALL",
        "LAUNCH": "21/09/2000"
      },
      {
        "OBJECT_NAME": "NOAA 16 DEB",
        "COUNTRY": "US",
        "PERIOD": 103.4,
        "INCLINATION": 98.84,
        "APOGEE": 991,
        "PERIGEE": 848,
        "RCS_SIZE": "SMALL",
        "LAUNCH": "21/09/2000"
      }
];
