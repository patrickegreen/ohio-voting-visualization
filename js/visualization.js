// Manage all visualization on the map

var districtData;
var legendConfig;
var geoGenerator;
var pieRadius = 25;
var colors = [
	'#7030A0',
	'#26E24A',
	'#ED8131',
	'#FFC000',
	'#E90BCF',
	'#A5A5A5',
];
var svg;
var width;
var height;
var legendBlockSize = 20;
var visualizationGroup;
var svgWidth;
var legend;
var votingLegend;
var sidebarWidth = 400;
var districtCentroids = {};

// Create global variables for the svg attributes and dataset
function initializeVis(dataGeo, dataDistrict, legends) {
	districtData = dataDistrict;
	legendConfig = legends;

	svg = d3.select('#svgMap');
	svgWidth = svg.attr('width');
	width = svgWidth - sidebarWidth;
	height = svg.attr('height');
	visualizationGroup = svg.append("g");
	// Geo scaling of data
	let projection = d3.geoEquirectangular()
		.fitExtent([[0, 0], [width, height]], dataGeo);
	geoGenerator = d3.geoPath()
		.projection(projection);

	// Create sidebar options for grouped data
	let sidebarGroupedOptions = [];
	let sidebarFlatOptions = [];
	for (dataKey in legendConfig) {
		if (legendConfig[dataKey].length > 0) {
			sidebarGroupedOptions.push(dataKey);
		} else {
			sidebarFlatOptions.push(dataKey);
		}
	}
	draw_sidebar(sidebarGroupedOptions, sidebarFlatOptions);
	initializeLegends();

	// Manually override the district centroids for pie charts
	for (var dID in CENTROIDS) {
		let latlng = CENTROIDS[dID];
		districtCentroids[dID] = projection([latlng[1], latlng[0]]);
	}
}

function draw_sidebar(groupOptions, flatOptions) {
    let totalOptions = groupOptions.length + flatOptions.length;
	let spacing = (800 / totalOptions);
	let options = svg.append('g')
        .attr("transform", "translate(800, 0)");
	options.selectAll("text.groupedOptions")
        .data(groupOptions)
        .enter()
    .append("text")
        .attr("x", 10)
        .attr("y", function(d, i) {
            return spacing * i + 40;
        })
        .attr("width", sidebarWidth - 20)
        .attr("height", spacing)
		.attr('font-family', 'cursive')
        .attr('class', 'groupedOptions demoOptions')
		.style('font-weight', 'bold')
        .style("font-size", 30)
        .style('text-decoration', 'underline')
        .text(function(d) {
            return d;
        })
        .on("click", function(d) {
            d3.selectAll('text.demoOptions').style('fill', 'black');
            d3.select(this).style('fill', '#26E24A');
            generateDemographicPies(d);
        });
	options.selectAll("text.flatOptions")
        .data(flatOptions)
        .enter()
    .append("text")
        .attr("x", 10)
        .attr("y", function(d, i) {
            return spacing * i + 40 + spacing * groupOptions.length;
        })
        .attr("width", sidebarWidth - 20)
        .attr("height", spacing)
		.attr('font-family', 'cursive')
        .attr('class', 'flatOptions demoOptions')
		.style('font-weight', 'bold')
        .style("font-size", 30)
        .text(function(d) {
            return d;
        })
        .on("click", function(d) {
            d3.selectAll('text.demoOptions').style('fill', 'black');
            d3.select(this).style('fill', '#26E24A');
            generateSizedCircles(d);
        });
	
}

// Initialize the static voting legend
function initializeLegends() {
	legend = svg.append('g')
		.attr("transform", "translate(" + (width - 200) + ", " + (height - 150) + ")");
	votingLegend = svg.append('g')
		.attr("transform", "translate(10, " + (height - 150) + ")");

	// Header
	votingLegend.append('text')
		.attr("transform", "translate(98, 80)")
		.text('Voting Results')
		.attr('fill', 'black')
		.attr('font-size', 24)
		.attr('font-family', 'cursive')
		.style('font-weight', 'bold');

	var colorScale = d3.scaleLinear()
      	.domain([0, 3, 6])
		.range(['red', 'white', 'blue']);

	for (var i = 0; i < 7; i++) {
		let offset = 100 + 25*i;
		votingLegend.append('rect')
			.attr("transform", "translate(" + offset + ", 100)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colorScale(i))
			.style('stroke', 'black')
			.style('stroke-width', 2);
	}
	votingLegend.append("text")
		.attr("transform", "translate(8, 114)")
		.text("Republican")
		.style('font-weight', 'bold');
	votingLegend.append("text")
		.attr("transform", "translate(280, 114)")
		.text("Democrat")
		.style('font-weight', 'bold');
}

// Generate pie charts for the grouped data
function generateDemographicPies(type) {
	visualizationGroup.selectAll("g").remove();

	// Create a pie for each district
	for (var idx = 0; idx < districtData.length; idx++) {
		let districtID = idx + 1;
		let districtRow = districtData[idx][type];
		let pieMaker = d3.pie();
		let districtPie = pieMaker(districtRow);
		let arcs = d3.arc()
			.innerRadius(0)
			.outerRadius(pieRadius);
		let districtPieGroup = visualizationGroup.append("g");
		districtPieGroup.selectAll("path")
			.data(districtPie)
			.enter()
			.append("path")
			.attr("transform", function (d, i) {
				return "translate (" + districtCentroids[districtID] + ")";
			})
			.attr("fill", function(d, i) {
				return colors[i];
			})
			.attr("d", arcs)
            .attr('class', 'pieChart')
			.style('stroke', 'black')
			.style('stroke-width', 2);
	}
	makeLegend(type, [], null);
}

function generateSizedCircles(type) {
	visualizationGroup.selectAll("g").remove();
    let circleGroup = visualizationGroup.append("g");
    let values = districtData.map(function(o) { return o[type]; });
    let mean = d3.mean(values);
    let stdev = d3.deviation(values);
	let sizeScale = d3.scaleLinear()
		.domain([mean - 3*stdev, mean + 3*stdev])
      	.range([10, 40]);
	for (var idx = 0; idx < districtData.length; idx++) {
		let districtID = idx + 1;
		let value = districtData[idx][type];
        let circle = circleGroup.append("circle")
            .attr("transform", function (d, i) {
                return "translate (" + districtCentroids[idx + 1] + ")";
            })
            .attr("fill", "#26E24A")
            .attr("r", function() {
                return sizeScale(value);
            })
			.style('stroke', 'black')
			.style('stroke-width', 2);
    makeLegend(type, values, sizeScale);
    }
}

// Generate Legend for grouped data
function makeLegend(type, values, sizeScale) {
	// Clear area for legend
	legend.selectAll("text").remove();
	legend.selectAll("rect").remove();
	legend.selectAll("circle").remove();
	options = legendConfig[type];

	// Grouped colors
    if (options.length) {
        legend.append('text')
            .attr("transform", "translate(0, -15)")
            .text('Demo Legend')
            .attr('fill', 'black')
            .attr('font-size', 24)
            .attr('font-family', 'cursive')
            .style('font-weight', 'bold');

        for (var i = 0; i < options.length; i++) {
            let textOffset = 15 + 25 * i;
            let colorOffset = 25 * i;
            legend.append("text")
                .attr("transform", "translate(0, " + textOffset + ")")
                .text(options[i])
                .attr('fill', 'black')
                .style('font-weight', 'bold');
            legend.append("rect")
                .attr("transform", "translate(175," + colorOffset + ")")
                .attr("width", legendBlockSize)
                .attr("height", legendBlockSize)
                .attr("fill", colors[i])
                .style('stroke', 'black')
                .style('stroke-width', 2);
        }
	} else {
        // Size Scale
        let mean = d3.mean(values);
        let stdev = d3.deviation(values);
        let offset = -90;
        let textAdjust = 2;
        if (!options.length) {
            for (var i = -2; i < 3; i++) {
                let value = mean + i * stdev;
                let radius = sizeScale(value);
                value = d3.max([value, 0]);  // avoid negatives for stdev range
                let textOffset = offset + textAdjust;
                legend.append("text")
                    .attr("transform", "translate(130, " + textOffset + ")")
                    .text(value.toFixed(1))
                    .attr('fill', 'black')
                    .style('font-weight', 'bold');
                legend.append("circle")
                    .attr("transform", "translate(85," + offset + ")")
                    .attr("fill", "#26E24A")
                    .attr("r", radius)
                    .style('stroke', 'black')
                    .style('stroke-width', 2);
                offset = offset + 2*radius + 5;
                textAdjust = textAdjust + 2;
            }
        }
    }
}