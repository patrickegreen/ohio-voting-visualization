
var countyData;
function renderMap(dataGeo, organizedData) {
	countyData = organizedData;
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
        .attr('d', geoGenerator);

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