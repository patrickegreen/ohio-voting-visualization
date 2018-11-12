// Tools for rendering the side graph

var graphMargin = 50;
var svgGraph;
var graphWidth;
var graphHeight;
var graphGroup;
var largePieRadius = 350;

function initializeGraph() {
    svgGraph = d3.select('#svgGraph');
    graphGroup = svgGraph.append("g");
    let boxWidth = svgGraph.attr('width');
    let boxHeight = svgGraph.attr('height');
    graphWidth = boxWidth - 2 * graphMargin;
    graphHeight = boxHeight - 2 * graphMargin;

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
}

function renderGraph(demoType, districtID) {
    // Three types of visualization
    //   (1) demoType is group, id specified >> show a blown-up pie chart for that district
    //   (2) demoType is group, no id specified >> show statewide average pie chart
    //   (3) demoType is flat, regardless of id >> show a bar chart by district (Not implemented)
    let options = legendConfig[demoType];
    if (options.length && districtID) {
        // (1) and (2)
        svgGraph.style("visibility", "visible");
        renderGraphPie(options, demoType, districtID);
    } else {
        // (3)
        svgGraph.style("visibility", "hidden");
        // renderGraphBars(demoType);
    }
}


function renderGraphPie(options, demoType, districtID) {
	graphGroup.selectAll("g").remove();
    activeDistrict = districtID;
	// Create a pie for the statewide average or a blow-up of a specific district
    if (districtID) {
        d3.select('text.chartText').html(demoType + ' (District ' + districtID + ')');
        let districtRow = districtData[districtID - 1][demoType];
        let totalRow = d3.sum(districtRow);
        let pieMaker = d3.pie();
        let districtPie = pieMaker(districtRow);
        let normalArc = d3.arc()
            .innerRadius(0)
            .outerRadius(largePieRadius);
        let focusArc = d3.arc()
            .innerRadius(0)
            .outerRadius(largePieRadius + 25);
        let districtPieGroup = graphGroup.append("g");
        let xCenter = graphMargin + 0.5 * graphWidth; // svgWidth is map offset
        let yCenter = 1.5 * graphMargin + 0.5 * graphHeight;
        districtPieGroup.selectAll("path.largePie")
            .data(districtPie)
            .enter()
        .append("path")
            .attr("transform", function (d, i) {
                return "translate (" + xCenter + ", " + yCenter + ")";
            })
            .attr("fill", function (d, i) {
                return colors[i];
            })
            .attr("d", normalArc)
            .attr('class', 'largePie')
            .style('stroke', 'black')
            .style('stroke-width', 2)
		.on('mouseover', function(d, i) {
            d3.select(this).transition()
              .duration(100)
              .attr("d", focusArc)
              .style('stroke-width', 5);
			return tooltip.html(
			    "<strong>" + options[i] + "</strong><br/>" +
                districtRow[i] + "<br/>" +
                (100 * districtRow[i] / totalRow).toFixed(1) + "%"
            )
            .style("Visibility", "Visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-10 +"px"))
			.style("left", (event.pageX+10 +"px"));
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-25 +"px"))
			.style("left", (event.pageX+25 +"px"));
		})
		.on("mouseout", function(d) {
            d3.select(this).transition()
              .duration(100)
              .attr("d", normalArc)
              .style('stroke-width', 2);
			return tooltip.style("Visibility", "hidden");
		});
    }
}

// Not implemented
function renderGraphBars(demoType) {
	graphGroup.selectAll("g").remove();
}

// Used to pop an item to the front of the visualization (ex. useful for ensuring highlighting stroke is visible)
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
}