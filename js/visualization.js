// Manage all visualization on the map

var districtData;
var legendConfig;
var geoGenerator;
var pieRadius = 25;
var colors = [ "Red", "Chartreuse", "Blue", "Brown", "Gold", "Cyan", "Green"];
var svg;
var width;
var height;
var legendBlockSize = 20;
var pieGroup;
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
	pieGroup = svg.append("g");
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
	draw_sidebar(sidebarGroupedOptions);
	initializeLegends();

	// Manually override the district centroids for pie charts
	for (var dID in CENTROIDS) {
		let latlng = CENTROIDS[dID];
		districtCentroids[dID] = projection([latlng[1], latlng[0]]);
	}
}

function draw_sidebar(options) {
	let barHeight = (800 / options.length);
	let wordG = svg.append('g')
			.attr("transform", "translate(800, 0)");
	wordG.selectAll("text")
        .data(options)
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", function(d, i) {
            return barHeight * i + 40;
        })
        .attr("width", sidebarWidth - 20)
        .attr("height", barHeight)
        .style("font-size", 40)
        .text(function(d) {
            return d;
        })
        .on("click", function(d) {
            generateDemographicPies(d);
        });
	
}

// Generate pie charts for the grouped data
function generateDemographicPies(type) {
	pieGroup.selectAll("g").remove();

	// Create a pie for each district
	for (var idx = 0; idx < districtData.length; idx++) {
		let districtID = idx + 1;
		let districtRow = districtData[idx][type];
		let pieMaker = d3.pie();
		let districtPie = pieMaker(districtRow);
		let arcs = d3.arc()
			.innerRadius(0)
			.outerRadius(pieRadius);
		let districtPieGroup = pieGroup.append("g");
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
			.attr("d", arcs);
	}
	makeLegend(type);
}

function initializeLegends() {
	legend = svg.append('g')
		.attr("transform", "translate(" + (width - 200) + ", " + (height - 150) + ")");
	votingLegend = svg.append('g')
		.attr("transform", "translate(10, " + (height - 150) + ")");
		
	votingLegend.append("text")
		.attr("transform", "translate(0, 115)")
		.text("District voted Republican")
		.attr("fill", d3.rgb(255, 0, 0));
	votingLegend.append("rect")
		.attr("transform", "translate(175,100)")
		.attr("width", legendBlockSize)
		.attr("height", legendBlockSize)
		.attr("fill", d3.rgb(255, 0, 0));
		
	votingLegend.append("text")
		.attr("transform", "translate(0, 140)")
		.text("District voted Democrat")
		.attr("fill", d3.rgb(0, 0, 255));
	votingLegend.append("rect")
		.attr("transform", "translate(175,125)")
		.attr("width", legendBlockSize)
		.attr("height", legendBlockSize)
		.attr("fill", d3.rgb(0, 0, 255));
}

function makeLegend(type) {
	// Clear area for legend
	legend.selectAll("text").remove();
	legend.selectAll("rect").remove();
	options = legendConfig[type];

	for (var i = 0; i < options.length; i++) {
		let textOffset = 15 + 25*i;
		let colorOffset = 25*i;
		legend.append("text")
			.attr("transform", "translate(0, " + textOffset + ")")
			.text(options[i])
			.attr("fill", colors[i]);
		legend.append("rect")
			.attr("transform", "translate(175," + colorOffset + ")")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[i]);

	}
}