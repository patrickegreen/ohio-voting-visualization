
var countyData;

var tooltip;
	
function renderMap(dataGeo, organizedData) {
	countyData = organizedData;
	tooltip = d3.select("body")
	.append("div")
	.style("width", "130px")
	.style("height", "60px")
	.style("padding", "2px")
	.style("background", "Bisque")
	.style("border", "0px")
	.style("border-radius", "8px")
	.style("text-align", "center")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("Future Votes!");
	
    let svg = d3.select('#svgMap');
    // Clear previous render
    svg.selectAll('*').remove();

    let width = svg.attr('width') - 400;
    let height = svg.attr('height');

    // Add bounding box
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width)
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);
		
    // Add bounding box
    svg.append('rect')
        .attr('x', width)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', 400)
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // Geo scaling of data
    let projection = d3.geoEquirectangular()
        .fitExtent([[0, 0], [width, height]], dataGeo);
    let geoGenerator = d3.geoPath()
        .projection(projection);

    // Append paths
    let paths = svg.selectAll('path')
        .data(dataGeo.features)
        .enter()
        .append('path')
        .style('stroke', 'black')
        .style('fill', function (d) {
			return getColor(parseInt(d.properties.CD115FP));
		})
        .attr('d', geoGenerator)
		.on("mouseover", function(d) {
			var votes = getVotes(parseInt(d.properties.CD115FP));
			return tooltip.html("District " + d.properties.CD115FP + " votes:<br/>Dem: " + votes[0] + "<br/>Rep: " + votes[1])
			.style("Visibility", "Visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-10 +"px"))
			.style("left", (event.pageX+10 +"px"));
		})
		.on("mouseout", function(d) {
			return tooltip.style("Visibility", "hidden");
		});

    // Tag features
    // let texts = svg.selectAll('text')
    //     .data(dataGeo.features)
    //     .enter()
    //     .append('text')
    //     .attr('text-anchor', 'middle')
    //     .attr('alignment-baseline', 'middle')
    //     .attr('opacity', 0.5)
    //     .attr('transform', function (d) {
    //         let center = geoGenerator.centroid(d);
    //         return 'translate (' + center + ')';
    //     });
}

function getColor(countyID) {
	var county = countyData[countyID - 1];
	var votes_d = parseInt(county.votes_D);
	var votes_r = parseInt(county.votes_R);
	var voteDiff = votes_d - votes_r;
	var relativeColor = 255 - 255 * Math.abs(voteDiff) / (votes_r + votes_d);
	if (voteDiff < 0) {
		return d3.rgb(255, relativeColor, relativeColor);
	}
	else {
		return d3.rgb(relativeColor, relativeColor, 255);
	}
}

function getVotes(countyID) {
	var county = countyData[countyID - 1];
	return [parseInt(county.votes_D), parseInt(county.votes_R)];
	
}