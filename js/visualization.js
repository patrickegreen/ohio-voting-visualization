//This file is not complete, it is what I was able to get done Wednesday

var demoData;
var votingData;
var geoData;
var districtData;
var legendConfig;

var geoGenerator;

var districtDemoData;
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
var sidebarWords = ["Race", "Age", "Median Income", "Median Age" /* Add more words here to add more visualizations */];
var districtCentroids = {};
//this function is complete
function initializeVis(dataDemos, dataVoting, dataGeo, organizedData, legends) {
	demoData = dataDemos;
	votingData = dataVoting;
	geoData = dataGeo;
	districtData = organizedData;
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
		draw_sidebar(sidebarWords);
	initializeLegends();
	// Manually override the district centroids for pie charts
	for (var dID in CENTROIDS) {
		let latlng = CENTROIDS[dID];
		districtCentroids[dID] = projection([latlng[1], latlng[0]]);
	}
}

function draw_sidebar(words) {
	var options = words.length;
	var barHeight = (800 / words.length);
	var wordG = svg.append('g')
			.attr("transform", "translate(800, 0)");
	wordG.selectAll("text")
        .data(words)
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

//this function is complete
function getDemoRow(subject, title) {
	for (var counter = 0; counter < demoData.length; counter++) {
		if (demoData[counter]["Subject"] == subject && demoData[counter]["Title"] == title) {
			return demoData[counter];
		}
	}
}

//this function is complete
function getGeo(distNum) {
	for (var counter = 0; counter < geoData.features.length; counter++) {
		if (parseInt(geoData.features[counter].properties.CD115FP) == parseInt(distNum)) {
			return geoData.features[counter];
		}
	}
}

//this function somewhat works but doesn't work quite right yet, had to stop early, this currently makes a pie graph of the demographics for each 
//	district, but they don't get positioned properly and the center of the pie chart is in the wrong spot
function generateDemographicPies(type) {
	pieGroup.selectAll("g").remove();
	districtDemoData = [];
	
	if (type == "Race") {
		//demographic rows for races
		let whiteRow = getDemoRow("Race", "White");
		let blackRow = getDemoRow("Race", "Black or African American");
		let asianRow = getDemoRow("Race", "Asian");
		let americanNativeRow = getDemoRow("Race", "American Indian and Alaska Native");
		let pacificIslanderRow = getDemoRow("Race", "Native Hawaiian and Other Pacific Islander");
		let otherRow = getDemoRow("Race", "Some other race");
		let twoPlusRow = getDemoRow("Race", "Two or more races");
		
		
		
		for (var counter = 1; counter < 17; counter++) {
			var districtRow = [parseInt(whiteRow[counter + ""]), parseInt(blackRow[counter + ""]), parseInt(asianRow[counter + ""]), parseInt(americanNativeRow[counter + ""]) +
				parseInt(pacificIslanderRow[counter + ""]) + parseInt(otherRow[counter + ""]), parseInt(twoPlusRow[counter + ""])];
			districtDemoData.push(districtRow);
			var pieMaker = d3.pie();
			var districtPie = pieMaker(districtRow);
			var arcs = d3.arc()
			.innerRadius(0)
			.outerRadius(pieRadius);
			var districtPieGroup = pieGroup.append("g");
			districtPieGroup.selectAll("path")
			.data(districtPie)
			.enter()
			.append("path")
			.attr("transform", function (d, i) {
				return "translate (" + districtCentroids[counter] + ")";
			})
			.attr("fill", function(d, i) {
				return colors[i];
			})
			.attr("d", arcs);
		}
		makeLegend(svg, "White", "Black or African American", "Asian", "Other Ethnicity", "Multiracial", "");
	} else if (type == "Age") {
		let yearsUnder5 = getDemoRow("Sex and Age", "Under 5 years");
		let years5To9 = getDemoRow("Sex and Age", "5 to 9 years");
		let years10To14 = getDemoRow("Sex and Age", "10 to 14 years");
		let years15To19 = getDemoRow("Sex and Age", "15 to 19 years");
		let years20To24 = getDemoRow("Sex and Age", "20 to 24 years");
		let years25To34 = getDemoRow("Sex and Age", "25 to 34 years");
		let years35To44 = getDemoRow("Sex and Age", "35 to 44 years");
		let years45To54 = getDemoRow("Sex and Age", "45 to 54 years");
		let years55To59 = getDemoRow("Sex and Age", "55 to 59 years");
		let years60To64 = getDemoRow("Sex and Age", "60 to 64 years");
		let years65To74 = getDemoRow("Sex and Age", "65 to 74 years");
		let years75To84 = getDemoRow("Sex and Age", "75 to 84 years");
		let years85Plus = getDemoRow("Sex and Age", "85 years and over");
		
		for (var counter = 1; counter < 17; counter++) {
			var districtRow = [parseInt(yearsUnder5[counter + ""]) + parseInt(years5To9[counter + ""]) + parseInt(years10To14[counter + ""]) + parseInt(years15To19[counter + ""]),
				parseInt(years20To24[counter + ""]) + parseInt(years25To34[counter + ""]), parseInt(years35To44[counter + ""]), parseInt(years45To54[counter + ""]) + 
				parseInt(years55To59[counter + ""]), parseInt(years60To64[counter + ""]) + parseInt(years65To74[counter + ""]), 
				parseInt(years75To84[counter + ""]) + parseInt(years85Plus[counter + ""])];
			districtDemoData.push(districtRow);
			var pieMaker = d3.pie();
			var districtPie = pieMaker(districtRow);
			var arcs = d3.arc()
			.innerRadius(0)
			.outerRadius(pieRadius);
			var districtPieGroup = pieGroup.append("g");
			districtPieGroup.selectAll("path")
			.data(districtPie)
			.enter()
			.append("path")
			.attr("transform", function (d, i) {
				return "translate (" + districtCentroids[counter] + ")";
			})
			.attr("fill", function(d, i) {
				return colors[i];
			})
			.attr("d", arcs);
		}
		makeLegend(svg, "Under 20", "20 to 34", "35 to 44", "45 to 59", "60 to 74", "75 and above");
	} else if (type == "Median Income") {
		var circleGroup = pieGroup.append("g");
		for (var counter = 1; counter < 17; counter++) {
			var incomeCircle = circleGroup.append("circle")
				.attr("transform", function (d, i) {
					return "translate (" + districtCentroids[counter] + ")";
				})
				.attr("fill", "Black")
				.attr("r", function() {
					return parseFloat(districtData[counter - 1]["Median Household Income"]) / 4000;
				});
			var incomeText = circleGroup.append("text")
				.attr("transform", function (d, i) {
					let center = districtCentroids[counter];
					return "translate (" + [center[0] + 20, center[1]] + ")";
				})
				.attr("fill", "Black")
				.text(districtData[counter - 1]["Median Household Income"]);
		}
	} else if (type == "Median Age") {
		var circleGroup = pieGroup.append("g");
		for (var counter = 1; counter < 17; counter++) {
			var incomeCircle = circleGroup.append("circle")
				.attr("transform", function (d, i) {
					return "translate (" + districtCentroids[counter] + ")";
				})
				.attr("fill", "Black")
				.attr("r", function() {
					return parseFloat(districtData[counter - 1]["Median Age"]) - 25;
				});
			var incomeText = circleGroup.append("text")
				.attr("transform", function (d, i) {
					let center = districtCentroids[counter];
					return "translate (" + [center[0] + 20, center[1]] + ")";
				})
				.attr("fill", "Black")
				.text(districtData[counter - 1]["Median Age"]);
		}
	}
}

function initializeLegends() {
	legend = svg.append('g')
		.attr("transform", "translate(" + (width - 200) + ", " + (height - 150) + ")");
	votingLegend = svg.append('g')
		.attr("transform", "translate(10, " + (height - 150) + ")");
		
	votingLegend.append("text")
		.attr("transform", "translate(0, 115)")
		.text("District voted republican")
		.attr("fill", d3.rgb(255, 0, 0));
	votingLegend.append("rect")
		.attr("transform", "translate(175,100)")
		.attr("width", legendBlockSize)
		.attr("height", legendBlockSize)
		.attr("fill", d3.rgb(255, 0, 0));
		
	votingLegend.append("text")
		.attr("transform", "translate(0, 140)")
		.text("District voted democrat")
		.attr("fill", d3.rgb(0, 0, 255));
	votingLegend.append("rect")
		.attr("transform", "translate(175,125)")
		.attr("width", legendBlockSize)
		.attr("height", legendBlockSize)
		.attr("fill", d3.rgb(0, 0, 255));
}

function makeLegend(inSVG, firstText, secondText, thirdText, fourthText, fifthText, sixthText) {
	//makes base area for legend
	legend.selectAll("text").remove();
	legend.selectAll("rect").remove();
	
	if (firstText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 15)")
			.text(firstText)
			.attr("fill", colors[0]);
			legend.append("rect")
			.attr("transform", "translate(175,0)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[0]);
	}
		
	if (secondText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 40)")
			.text(secondText)
			.attr("fill", colors[1]);
			legend.append("rect")
			.attr("transform", "translate(175,25)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[1]);
	}
		
	if (thirdText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 65)")
			.text(thirdText)
			.attr("fill", colors[2]);
			legend.append("rect")
			.attr("transform", "translate(175,50)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[2]);
	}
		
	if (fourthText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 90)")
			.text(fourthText)
			.attr("fill", colors[3]);
			legend.append("rect")
			.attr("transform", "translate(175,75)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[3]);
	}
		
	if (fifthText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 115)")
			.text(fifthText)
			.attr("fill", colors[4]);
			legend.append("rect")
			.attr("transform", "translate(175,100)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[4]);
	}
	
	if (sixthText != "") {
		legend.append("text")
			.attr("transform", "translate(0, 140)")
			.text(sixthText)
			.attr("fill", colors[5]);
			legend.append("rect")
			.attr("transform", "translate(175,125)")
			.attr("width", legendBlockSize)
			.attr("height", legendBlockSize)
			.attr("fill", colors[5]);
	}
}