//This file is not complete, it is what I was able to get done Wednesday

var demoData;
var votingData;
var geoData;

var geoGenerator;

var countyDemoData;
var pieRadius = 25;
var colors = [ "Red", "Chartreuse", "Blue", "Brown", "Gold", "Cyan", "Blue"];
var svg;
var width;
var height;
var legendBlockSize = 20;
//this function is complete
function initializeVis(dataDemos, dataVoting, dataGeo) {
  demoData = dataDemos;
  votingData = dataVoting;
  geoData = dataGeo;
  
  svg = d3.select('#svgMap');
  width = +svg.attr('width');
  height = +svg.attr('height');

    // Geo scaling of data
    let projection = d3.geoEquirectangular()
        .fitExtent([[0, 0], [width, height]], dataGeo);
    geoGenerator = d3.geoPath()
        .projection(projection);
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
function generateDemographicPies() {
	countyDemoData = [];
	
	//demographic rows for races
	let whiteRow = getDemoRow("Race", "White");
	let blackRow = getDemoRow("Race", "Black or African American");
	let asianRow = getDemoRow("Race", "Asian");
	let americanNativeRow = getDemoRow("Race", "American Indian and Alaska Native");
	let pacificIslanderRow = getDemoRow("Race", "Native Hawaiian and Other Pacific Islander");
	let otherRow = getDemoRow("Race", "Some other race");
	let twoPlusRow = getDemoRow("Race", "Two or more races");
	let pieGroup = svg.append("g");
	
	for (var counter = 1; counter < 17; counter++) {
		var countyRow = [parseInt(whiteRow[counter + ""]), parseInt(blackRow[counter + ""]), parseInt(asianRow[counter + ""]), parseInt(americanNativeRow[counter + ""]) + 
			parseInt(pacificIslanderRow[counter + ""]) + parseInt(otherRow[counter + ""]), parseInt(twoPlusRow[counter + ""])];
		countyDemoData.push(countyRow);
		var pieMaker = d3.pie();
		var countyPie = pieMaker(countyRow);
		var arcs = d3.arc()
		.innerRadius(0)
		.outerRadius(pieRadius);
		var countyPieGroup = pieGroup.append("g");
		countyPieGroup.selectAll("path")
		.data(countyPie)
		.enter()
		.append("path")
		.attr("transform", function (d, i) {
			var center = geoGenerator.centroid(getGeo(counter));
			return "translate (" + center + ")";
		})
		.attr("fill", function(d, i) {
			return colors[i];
		})
		.attr("d", arcs);
	}
	makeLegend(svg);
}

function makeLegend(inSVG) {
	//makes base area for legend
	var legend = inSVG.append('g')
		.attr("transform", "translate(" + (width - 200) + ", " + (height - 125) + ")");
	
	//White
	legend.append("text")
	.attr("transform", "translate(0, 15)")
	.text("White")
	.attr("fill", colors[0]);
	legend.append("rect")
	.attr("transform", "translate(175,0)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[0]);
		
	//Black or African American
	legend.append("text")
	.attr("transform", "translate(0, 40)")
	.text("Black or African American")
	.attr("fill", colors[1]);
	legend.append("rect")
	.attr("transform", "translate(175,25)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[1]);
		
	//Asian
	legend.append("text")
	.attr("transform", "translate(0, 65)")
	.text("Asian")
	.attr("fill", colors[2]);
	legend.append("rect")
	.attr("transform", "translate(175,50)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[2]);
		
	//Other Ethnicity
	legend.append("text")
	.attr("transform", "translate(0, 90)")
	.text("Other Ethnicity")
	.attr("fill", colors[3]);
	legend.append("rect")
	.attr("transform", "translate(175,75)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[3]);
		
	//Multiracial
	legend.append("text")
	.attr("transform", "translate(0, 115)")
	.text("Multiracial")
	.attr("fill", colors[4]);
	legend.append("rect")
	.attr("transform", "translate(175,100)")
	.attr("width", legendBlockSize)
	.attr("height", legendBlockSize)
	.attr("fill", colors[4]);
		
}