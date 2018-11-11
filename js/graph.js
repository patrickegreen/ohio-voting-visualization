// Tools for rendering the side graph

var graphMargin = 50;
var svgGraph;

function renderGraph(demoType, districtID) {
    svgGraph = d3.select('#svgGraph');
    svgGraph.selectAll('*').remove();
    let boxWidth = svgGraph.attr('width');
    let boxHeight = svgGraph.attr('height');
    let graphWidth = boxWidth - 2 * graphMargin;
    let graphHeight = boxHeight - 2 * graphMargin;

    // Add bounding box
    svgGraph.append('text')
        .attr("transform", "translate(15, 40)")
        .attr('class', 'chartText')
        .text('Placeholder for Selected Data')
        .attr('fill', 'black')
        .attr('font-size', 24)
        .attr('font-family', 'cursive')
        .style('font-weight', 'bold');
    svgGraph.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // Three types of visualization
    //   (1) demoType is group, no id specified >> show multi-line chart comparing districts across categories
    //   (2) demoType is group, id specified >> show a blown-up pie chart for that district
    //   (3) demoType is flat, regardless of id >> show a bar chart by district
    let options = legendConfig[demoType];
    if (options.length && districtID) {
        // (1)
        renderGraphLines(options, demoType, districtID);
    } else if (options.length) {
        // (2)
        renderGraphPie(options, demoType, districtID);
    } else {
        // (3)
        renderGraphBars(demoType);
    }
}

function renderGraphLines(options, demoType, districtID) {
    var n = 21;
    //
    // // 5. X scale will use the index of our data
    // var xScale = d3.scaleLinear()
    //     .domain([0, n-1]) // input
    //     .range([0, width]); // output
    //
    // // 6. Y scale will use the randomly generate number
    // var yScale = d3.scaleLinear()
    //     .domain([0, 1]) // input
    //     .range([height, 0]); // output
    //
    // // 7. d3's line generator
    // var line = d3.line()
    //     .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    //     .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    //     .curve(d3.curveMonotoneX) // apply smoothing to the line
    //
    // // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    // var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
    //
    // // 1. Add the SVG to the page and employ #2
    // var svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    // // 3. Call the x axis in a group tag
    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
    //
    // // 4. Call the y axis in a group tag
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
    //
    // // 9. Append the path, bind the data, and call the line generator
    // svg.append("path")
    //     .datum(dataset) // 10. Binds data to the line
    //     .attr("class", "line") // Assign a class for styling
    //     .attr("d", line); // 11. Calls the line generator
    //
    // // 12. Appends a circle for each datapoint
    // svg.selectAll(".dot")
    //     .data(dataset)
    //   .enter().append("circle") // Uses the enter().append() method
    //     .attr("class", "dot") // Assign a class for styling
    //     .attr("cx", function(d, i) { return xScale(i) })
    //     .attr("cy", function(d) { return yScale(d.y) })
    //     .attr("r", 5)
    //       .on("mouseover", function(a, b, c) {
    //             console.log(a)
    //         this.attr('class', 'focus')
    //         })
    //       .on("mouseout", function() {  })
}

function renderGraphPie(options, demoType, districtID) {
	return null;
}

function renderGraphBars(demoType) {
	return null;
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
}