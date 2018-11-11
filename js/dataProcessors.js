function processDemos(row, idx, columns) {
    return row;
}

function processVoting(row, idx, columns) {
    return row;
}

function processGeo(row, idx, columns) {
    return row;
}

// Pull out select demos and tag data to the corresponding districts
//      There are two kinds of demos (1) flat (total pop, age 18+), and (2) grouped (age ranges, races)
//      (1) Flat demos are mapped to a clean key name
//          FLAT_DEMOS[Topic][Subject][Title] = new_key
//      (2) Grouped demos are flattened to an array under a new key, with clean sub-group names for reference
//          GROUP_DEMOS[Topic][Subject][Title] = [group_key, new_column]
// Due to the nature of legend design, maximum of six categories in grouped values
var DEMOS = {
    'People': {
        'Sex and Age': {
            'Total population': 'Population',
            'Male': ['Sex', 'Male'],
            'Female': ['Sex', 'Female'],
            'Under 5 years': ['Age Range', 'Under 10'],
            '5 to 9 years': ['Age Range', 'Under 10'],
            '10 to 14 years': ['Age Range', '10 to 20'],
            '15 to 19 years': ['Age Range', '10 to 20'],
            '20 to 24 years': ['Age Range', '20 to 34'],
            '25 to 34 years': ['Age Range', '20 to 34'],
            '35 to 44 years': ['Age Range', '35 to 54'],
            '45 to 54 years': ['Age Range', '35 to 54'],
            '55 to 59 years': ['Age Range', '55 to 64'],
            '60 to 64 years': ['Age Range', '55 to 64'],
            '65 to 74 years': ['Age Range', '65+'],
            '75 to 84 years': ['Age Range', '65+'],
            '85 years and over': ['Age Range', '65+'],
            'Median age (years)': 'Median Age',
            '18 years and over': 'Voting Age Population',
        },
        'Race': {
            'White': ['Race', 'White'],
            'Black or African American': ['Race', 'Black'],
            'American Indian and Alaska Native': ['Race', 'American Native'],
            'Asian': ['Race', 'Asian/Pacific Islander'],
            'Native Hawaiian and Other Pacific Islander': ['Race', 'Asian/Pacific Islander'],
            'Some other race': ['Race', 'Other'],
            'Two or more races': ['Race', 'Multi-racial'],
        },
        'Hispanic or Latino and Race': {
            'Hispanic or Latino (of any race)': 'Hispanic/Latino Population',
        },
        'Place of Birth': {
            'Foreign born': 'Foreign-born Population',
        },
        'Veteran Status': {
            'Civilian veterans': 'Veteran Population',
        },
    },
    'Workers': {
        'Employment Status': {
            'Unemployment Rate': 'Unemployment Rate',
        },
        'Occupation': {
            'Management, business, science, and arts occupations': ['Occupation', 'Business/Science/Arts'],
            'Service occupations': ['Occupation', 'Service'],
            'Sales and office occupations': ['Occupation', 'Sales/Office'],
            'Natural resources, construction, and maintenance occupations': ['Occupation', 'Construction/Maint.'],
            'Production, transportation, and material moving occupations': ['Occupation', 'Production/Transport'],
        },
    },
    'Housing': {
        'Value': {
            'Median (dollars)': 'Median Housing Value',
        },
        'Housing Occupancy': {
            'Occupied housing units': ['Housing', 'Occupied Units'],
            'Vacant housing units': ['Housing', 'Vacant Units'],
        }
    },
    'Socioeconomic': {
        'Income and Benefits (In 2017 inflation-adjusted dollars)': {
            'Median household income (dollars)': 'Median Household Income',
            'Less than $10,000': ['Income Range', 'Less than $15,000'],
            '$10,000 to $14,999': ['Income Range', 'Less than $15,000'],
            '$15,000 to $24,999': ['Income Range', '$15,000 to $34,999'],
            '$25,000 to $34,999': ['Income Range', '$15,000 to $34,999'],
            '$35,000 to $49,999': ['Income Range', '$35,000 to $49,999'],
            '$50,000 to $74,999': ['Income Range', '$50,000 to $99,999'],
            '$75,000 to $99,999': ['Income Range', '$50,000 to $99,999'],
            '$100,000 to $149,999': ['Income Range', '$100,000 to $149,999'],
            '$150,000 to $199,000': ['Income Range', '$150,000 or more'],
            '$200,000 or more': ['Income Range', '$150,000 or more'],
        },
        'Percentage of Families and People Whose Income in the Past 12 Months is Below the Poverty Level': {
            'All people': 'Percentage of Families Below Poverty Level',
        }
    },
    'Education': {
        'Educational Attainment': {
            'Less than 9th grade': ['Education', 'Middle School'],
            '9th to 12th grade, no diploma': ['Education', 'High School (no diploma)'],
            'High school graduate (includes equivalency)': ['Education', 'HS Graduate or GED'],
            'Some college, no degree': ['Education', 'College (no degree)'],
            "Associate's degree": ['Education', 'Associates'],
            "Bachelor's degree": ['Education', 'Bachelors'],
            'Graduate or professional degree': ['Education', 'Graduate/Professional'],
        }
    }
}

// Merges the
function combineData(dataVoting, dataDemos) {
    // For each district, tag demo data
    var legends = {};
    var groupKey;
    var valueKey;
    var consolidateIndex;
    for (var k = 0; k < dataDemos.length; k++) {
        let r = dataDemos[k];
        // Only process a demo row if there is CONFIG for it
        if (DEMOS[r['Topic']] && DEMOS[r['Topic']][r['Subject']] && DEMOS[r['Topic']][r['Subject']][r['Title']]) {
            let rConfig = DEMOS[r['Topic']][r['Subject']][r['Title']];
            let isGrouped = Array.isArray(rConfig);

            // Update the legend and track whether or not multiple data values consolidate
            if (isGrouped) {
                groupKey = rConfig[0];
                valueKey = rConfig[1];

                // Update legends
                if (groupKey in legends) {
                    // See if legend already has value >> means two attributes are consolidated
                    consolidateIndex = legends[groupKey].indexOf(valueKey);
                    if (consolidateIndex < 0 ) {
                        // Only update the legend if not a consolidated value
                        legends[groupKey].push(valueKey);
                    }
                } else {
                    legends[groupKey] = [valueKey];
                    consolidateIndex = -1;
                }
            } else{
                groupKey = null;
                valueKey = rConfig;
                consolidateIndex = -1;
                legends[valueKey] = [];
            }

            // Update this demographic for each district
            for (var i = 0; i < dataVoting.length; i++) {
                let district = dataVoting[i]['id'];
                // Get the config for the demoRow
                let value = +r[district];
                if (isGrouped) {
                    // Add to array of values or create new array
                    if (consolidateIndex >= 0) {
                        // Add this value to the corresponding item in array
                        dataVoting[i][groupKey][consolidateIndex] += value;
                    } else if (groupKey in dataVoting[i]) {
                        dataVoting[i][groupKey].push(value);
                    } else {
                        dataVoting[i][groupKey] = [value];
                    }
                } else {
                    dataVoting[i][valueKey] = value;
                }
                // }
            }
        }
    }
    return {districtData: dataVoting, legendConfig: legends};
}