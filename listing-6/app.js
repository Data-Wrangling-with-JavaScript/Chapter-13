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
    var maxDistanceFromEarth = 6000; // Let's put a limit on what we can display.

    d3.json("data/data.json")
        .then(function (data) {

            var filteredData = data.filter(x => x.RCS_SIZE) // Filter out data that is incomplete.
                .filter(x => x.PERIGEE !== undefined)
                .filter(x => x.PERIGEE <= maxDistanceFromEarth); // Filter out data beyond our limit.

            data.forEach(function (row) {
                row.orbitAngle = Math.random() * 360;
            });
                            
            var maxOrbitRadius = d3.max(filteredData.map(x => earthRadius + x.PERIGEE)); // Determine the maximum orbit distance from the earth.

            var radiusScale = d3.scaleLinear() // Create a scale for the radius.
                .domain([0, maxOrbitRadius])
                .range([0, Math.min(height/2, width/2)]);
            
            function computeSpaceJunkPosition (row) { // Function to compute the position of space junk within the visualization, we need to reuse this now.
                var orbitRadius = radiusScale(earthRadius + row.PERIGEE); // The distance from the center of the earth that the space junk is orbiting.
                var point = pointOnCircle(orbitRadius, row.orbitAngle); // Choose a random position in orbit that is relative to the earth.
                return { 
                    x: (width/2) + point.x, // Translate the space junk coordinates into visualization-relative coordinates., 
                    y: (height/2) + point.y 
                };
            };

            function hover (row, index) { // Function called when a space junk is hovered.

                d3.select(this)
                    .select("circle")
                        .attr("r", 6); // Make the hovered space junk larger.
            
                var pos = computeSpaceJunkPosition(row);
            
                svgElement // Add hover text.
                    .append("text") // Append the hover text to the end of the SVG so it is rendered over the top of everything else.
                        .attr("id", "hovertext-" + index) // Id the text so we can remove it later.
                        .attr("x", pos.x)
                        .attr("y", pos.y)
                        .attr("font-size", 20)
                        .attr("font-weight", "bold")
                        .text(function() {
                            return row.OBJECT_NAME;
                        });
            };
            
            function unhover (row, index) { // Function called when a space junk is unhovered.
            
                d3.select(this)
                    .select("circle")
                        .attr("r", 2); // Revert the hovered space junk to normal size.
            
                d3.select("#hovertext-" + index)
                    .remove(); // Remove the hover text.
            };
                        
            var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
                .attr("width", width) // Set the width and height of the elemnt.
                .attr("height", height);
        
            svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
                .attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
                .attr("transform", "translate(" + (width/2) + ", " + (height/2) + ")") // Position the circle in the middle of the visualization.
                .attr("r", radiusScale(earthRadius)); // Set the radius the earth.

            svgElement.selectAll("g") // Select all g elements.
                .data(filteredData) // 'Join' our data to the selection.
                .enter() // Specify what happens for each incoming data point.
                    .append("g") // Append a group element for each data point.
                    .on("mouseover", hover)
                    .on("mouseout", unhover)
                    .attr("class", function  (dataPoint) { // Set CSS clas so we can style our space junk.
                        return "junk " + dataPoint.RCS_SIZE;
                    })
                    .attr("transform", function(row, index) { // Set the transform element to position the space junk in orbit around the 'earth'.
                        var pos = computeSpaceJunkPosition(row);
                        return "translate(" + pos.x + ", " + pos.y + ")" ; // Synthesize an SVG 'transform' attribute.
                    })
                    .append("circle") // Add a circle to represent the space junk.
                        .attr("r", 2); // Hard-coded circle radius.
        })
        .catch(function (err) {
            console.error("Failed to load data file.");
            console.error(err);
        });
};
