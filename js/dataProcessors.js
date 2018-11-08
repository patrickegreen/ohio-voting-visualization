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
//          if new_column is null, use Title
var DEMOS = {
    'People': {
        'Sex and Age': {
            'Total population': 'Population',
            'Male': ['Sex', null],
            'Female': ['Sex', null],
            'Under 5 years': ['Age Range', null],
            '5 to 9 years': ['Age Range', null],
            '10 to 14 years': ['Age Range', null],
            '15 to 19 years': ['Age Range', null],
            '20 to 24 years': ['Age Range', null],
            '25 to 34 years': ['Age Range', null],
            '35 to 44 years': ['Age Range', null],
            '45 to 54 years': ['Age Range', null],
            '55 to 59 years': ['Age Range', null],
            '60 to 64 years': ['Age Range', null],
            '65 to 74 years': ['Age Range', null],
            '75 to 84 years': ['Age Range', null],
            '85 years and over': ['Age Range', '85+'],
            'Median age (years)': 'Median Age',
            '18 years and over': 'Voting Age Population',
        },
        'Race': {
            'White': ['Race', null],
            'Black or African American': ['Race', null],
            'American Indian and Alaska Native': ['Race', null],
            'Asian': ['Race', null],
            'Native Hawaiian and Other Pacific Islander': ['Race', null],
            'Some other race': ['Race', 'Other'],
            'Two or more races': ['Race', 'Multiple'],
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
            'Management, business, science, and arts occupations': ['Occupation', 'Management/Business/Science/Arts'],
            'Service occupations': ['Occupation', 'Service'],
            'Sales and office occupations': ['Occupation', 'Sales/Office'],
            'Natural resources, construction, and maintenance occupations': ['Occupation', 'Natural Resources/Construction/Maintenance'],
            'Production, transportation, and material moving occupations': ['Occupation', 'Production/Transportation/Material Moving'],
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
            'Less than $10,000': ['Income Range', null],
            '$10,000 to $14,999': ['Income Range', null],
            '$15,000 to $24,999': ['Income Range', null],
            '$25,000 to $34,999': ['Income Range', null],
            '$35,000 to $49,999': ['Income Range', null],
            '$50,000 to $74,999': ['Income Range', null],
            '$75,000 to $99,999': ['Income Range', null],
            '$100,000 to $149,999': ['Income Range', null],
            '$150,000 to $199,000': ['Income Range', null],
            '$200,000 or more': ['Income Range', null],
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
    for (var i = 0; i < dataVoting.length; i++) {
        let district = dataVoting[i]['id'];
        console.log(dataVoting[i]);
        for (var k = 0; k < dataDemos.length; k++) {
            // Get the config for the demoRow
            let r = dataDemos[k];
            if (DEMOS[r['Topic']] && DEMOS[r['Topic']][r['Subject']] && DEMOS[r['Topic']][r['Subject']][r['Title']]) {
                let rConfig = DEMOS[r['Topic']][r['Subject']][r['Title']];

                let isGrouped = Array.isArray(rConfig);
                let value = +r[district];
                if (isGrouped) {
                    // Contains a group key and optional column rename
                    let groupKey = rConfig[0];
                    // Add to array of values or create new array
                    if (groupKey in dataVoting[i]) {
                        dataVoting[i][groupKey].push(value);
                    } else {
                        dataVoting[i][groupKey] = [value];
                    }
                } else {
                    let groupKey = rConfig;
                    dataVoting[i][groupKey] = value;
                }
            }
        }
    }
    return dataVoting;
}