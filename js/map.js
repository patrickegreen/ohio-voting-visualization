
var districtData;

var tooltip;

var CENTROIDS = {
    1: [39.418203, -84.166441],
    2: [39.003667, -83.454167],
    3: [40.084454, -82.942875],
    4: [40.534428, -84.126369],
    5: [41.377887, -84.126369],
    6: [40.174982, -81.140202],
    7: [40.421820, -81.888509],
    8: [40.087679, -84.632341],
    9: [41.534706, -82.721268],
    10: [39.699015, -83.989342],
    11: [41.555293, -81.581789],
    12: [40.561171, -82.727309],
    13: [41.204422, -80.777782],
    14: [41.599710, -80.959752],
    15: [39.621678, -82.535068],
    16: [40.872652, -81.851527],
}
function renderMap(dataGeo, mergedData) {
	districtData = mergedData;
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
}

// Shade the district based on the degree votes favor one party or the other
//  scales red >> white >> blue
function getColor(districtID) {
	var district = districtData[districtID - 1];
	var votes_d = parseInt(district.votes_D);
	var votes_r = parseInt(district.votes_R);
	var voteDiff = votes_d - votes_r;
	var relativeColor = 255 - 255 * Math.abs(voteDiff) / (votes_r + votes_d);
	if (voteDiff < 0) {
		return d3.rgb(255, relativeColor, relativeColor);
	} else if (voteDiff > 0) {
		return d3.rgb(relativeColor, relativeColor, 255);
	} else {
	    return d3.rgb(255, 255, 255);
    }

}

function getVotes(districtID) {
	var district = districtData[districtID - 1];
	return [parseInt(district.votes_D), parseInt(district.votes_R)];
	
}