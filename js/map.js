function renderMap(dataGeo) {
    let svg = d3.select('#svgMap');
    // Clear previous render
    svg.selectAll('*').remove();

    let width = +svg.attr('width');
    let height = +svg.attr('height');

    // Add bounding box
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width)
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
        .style('fill', 'gray')
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