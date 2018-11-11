
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
function renderMap(dataGeo, data) {
	districtData = data;
	tooltip = d3.select("body")
        .append("div")
        .style("width", "160px")
        .style("height", "80px")
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
    svg.append('text')
		.attr("transform", "translate(15, 40)")
		.text('Ohio Congressional Voting and Demographics (2016 Election)')
		.attr('fill', 'black')
		.attr('font-size', 24)
		.attr('font-family', 'cursive')
		.style('font-weight', 'bold');
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

    // Color scale - effectively percentage democrat voting
	let colorScale = d3.scaleLinear()
      	.domain([0, 0.5, 1])
		.range(['red', 'white', 'blue']);

    // Append paths
    let paths = svg.selectAll('path')
        .data(dataGeo.features)
        .enter()
        .append('path')
        .style('stroke', 'black')
        .style('fill', function (d) {
			return getColor(colorScale, parseInt(d.properties.CD115FP));
		})
        .attr('d', geoGenerator)
		.on("mouseover", function(d, i) {
		    let districtID = parseInt(d.properties.CD115FP);
		    let district = districtData[districtID-1];
			let votesR = +district.votes_R;
			let votesD = +district.votes_D;
			let votesI = +district.votes_I;
			let total = votesR + votesD + votesI;
			d3.select(this).style('stroke-width', 4);
			return tooltip.html(
			    "<strong>District " + d.properties.CD115FP + " votes:<br/></strong>" +
                "<a class='republican'><strong>Rep:</strong></a> " + votesR + " (" + (100.0 * votesR / total).toFixed(1) + "%)" + "<br/>" +
                "<a class='democrat'><strong>Dem:</strong></a> " + votesD + " (" + (100.0 * votesD / total).toFixed(1) + "%)" + "<br/>" +
                "<a class='independent'><strong>Ind:</strong></a> " + votesI + " (" + (100.0 * votesI / total).toFixed(1) + "%)"
            )
			    .style("Visibility", "Visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-10 +"px"))
			.style("left", (event.pageX+10 +"px"));
		})
		.on("mouseout", function(d) {
			d3.select(this).style('stroke-width', 1);
			return tooltip.style("Visibility", "hidden");
		});
}

// Shade the district based on the degree votes favor one party or the other
function getColor(colorScale, districtID) {
    let district = districtData[districtID-1];
    let votesR = +district.votes_R;
    let votesD = +district.votes_D;
    let votesI = +district.votes_I;
    let total = votesR + votesD + votesI;
    let hue = votesD / total;
    return colorScale(hue);
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
};