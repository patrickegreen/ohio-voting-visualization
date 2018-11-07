//This file is not complete, it is what I was able to get done Wednesday

var demoData;
var votingData;
var geoData;

var geoGenerator;

var countyDemoData;
var pieRadius = 30;
var colors = [ "Red", "Orange", "Yellow", "Green", "Blue", "Cyan", "Purple"];
var svg;

//this function is complete
function initializeVis(dataDemos, dataVoting, dataGeo) {
  demoData = dataDemos;
  votingData = dataVoting;
  geoData = dataGeo;
  
  svg = d3.select('#svgMap');
  let width = +svg.attr('width');
    let height = +svg.attr('height');

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
		var arcs = d3.arc().outerRadius(pieRadius);
		var countyPieGroup = pieGroup.append("g");
		countyPieGroup.selectAll("path")
		.data(countyPie)
		.enter()
		.append("path")
		.attr("d", arcs)
		.attr("transform", function () {
			return "translate (" + (-70 + counter * 80) + ", 40)";
		})
		.attr("fill", function(d, i) {
			return colors[i];
		});
	}

}
