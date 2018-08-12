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
    var earthTranslation = "translate(" + (width/2) + ", " + (height/2) + ")"; // Setup a translation to position the earth.
    var maxDistanceFromEarth = 6000; // Let's put a limit on what we can display.

    d3.json("data/us-space-junk.json")
        .then(function (spaceJunkData) {

            var filteredData = spaceJunkData.filter(spaceJunkRecord => spaceJunkRecord.PERIGEE <= maxDistanceFromEarth); // Filter out data beyond our limit.

            spaceJunkData.forEach(function (spaceJunkRecord) {
                spaceJunkRecord.orbitAngle = Math.random() * 360;
            });
                            
            var maxOrbitRadius = d3.max(filteredData.map(spaceJunkRecord => earthRadius + spaceJunkRecord.PERIGEE)); // Determine the maximum orbit distance from the earth.

            var radiusScale = d3.scaleLinear() // Create a scale for the radius.
                .domain([0, maxOrbitRadius])
                .range([0, Math.min(height/2, width/2)]);
            
            function computeSpaceJunkPosition (spaceJunkRecord) { // Function to compute the position of space junk within the visualization, we need to reuse this now.
                var orbitRadius = radiusScale(earthRadius + spaceJunkRecord.PERIGEE); // The distance from the center of the earth that the space junk is orbiting.
                var point = pointOnCircle(orbitRadius, spaceJunkRecord.orbitAngle); // Choose a random position in orbit that is relative to the earth.
                return { 
                    x: (width/2) + point.x, // Translate the space junk coordinates into visualization-relative coordinates., 
                    y: (height/2) + point.y 
                };
            };

            function spaceJunkTranslation (spaceJunkRecord) {
                var pos = computeSpaceJunkPosition(spaceJunkRecord, spaceJunkRecord.PERIGEE);
                return "translate(" + pos.x + ", " + pos.y + ")" ;
            };

            function addText (className, text, pos, offset) { // Helper function to add some hover text.
                svgElement.append("text") // Append the hover text to the end of the SVG so it is rendered over the top of everything else.
                    .attr("class", className) // Id the text so we can remove it later.
                    .attr("x", pos.x)
                    .attr("y", pos.y + offset) // Offset the Y position slightly so the text is below the space junk.
                    .text(text);
            };

            function hover (spaceJunkRecord, index) { // Function called when a space junk is hovered.

                d3.select(this)
                    .select("circle")
                        .attr("r", 6); // Make the hovered space junk larger.
            
                var pos = computeSpaceJunkPosition(spaceJunkRecord);
                addText("hover-text hover-title", spaceJunkRecord.OBJECT_NAME, pos, 50);
                addText("hover-text", "Size: " + spaceJunkRecord.RCS_SIZE, pos, 70);
                addText("hover-text", "Launched: " + spaceJunkRecord.LAUNCH, pos, 85);
            };
            
            function unhover (spaceJunkRecord, index) { // Function called when a space junk is unhovered.
            
                d3.select(this)
                    .select("circle")
                        .attr("r", 2); // Revert the hovered space junk to normal size.
            
                d3.selectAll(".hover-text")
                    .remove(); // Remove all hover text.
            };
                        
            var svgElement = d3.select("svg.chart") // Select the root SVG element for our visualization.
                .attr("width", width) // Set the width and height of the elemnt.
                .attr("height", height);
        
            var theEarth = svgElement.append("circle") // Add a circle to our visualization to represent the 'earth'.
            theEarth.attr("class", "earth") // Set the CSS class for the element to so that we can style our 'earth'.
                .attr("transform", earthTranslation) // Position the circle in the middle of the visualization.
                .attr("r", radiusScale(earthRadius)); // Set the radius the earth.

            var spaceJunk = svgElement.selectAll("g") // Select all g elements.
                .data(filteredData); // 'Join' our data to the selection.
            spaceJunk.enter() // Specify what happens for each incoming data point.
                    .append("g") // Append a group element for each data point.
                        .attr("class", function  (spaceJunkRecord) { // Set CSS clas so we can style our space junk.
                            return "junk " + spaceJunkRecord.RCS_SIZE;
                        })
                        .attr("transform", spaceJunkTranslation)
                    .on("mouseover", hover)
                    .on("mouseout", unhover)
                    .append("circle") // Add a circle to represent the space junk.
                        .attr("r", 2); // Hard-coded circle radius.
        })
        .catch(function (err) {
            console.error("Failed to load data file.");
            console.error(err);
        });
};
