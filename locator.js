// base case data for user
navigator.geolocation.getCurrentPosition(GPSsuccess, GPSerror, options);
gpsLoc = {};
userElev = 0;


// Color arrays for Midi and associated RGB values for on screen display
// color arrays structured as such -> [l, l, l, l ,l, l, 0, g, g, g, g, g, g]
// to index using the color value mapping function, use -> array[6 + colorValue]
const midiColors = [11, 10, 7, 6, 5, 4, 3, 17, 25, 33, 41, 49, 57];
const RGBColors = [
    "rgb(175, 120, 95)", "rgb(176, 100, 95)", "rgb(176, 100, 95)", "rgb(221, 97, 97)", "rgb(255, 96, 96)", "rgb(255, 180, 175)",
    "rgb(50, 50, 50)", "rgb(194, 255, 84)", "rgb(100, 254, 142)", "rgb(93, 255, 239)", "rgb(98, 198, 255)", "rgb(163, 94, 255)", "rgb(255, 94, 193)"
];


/**
 * Actions to take on key press
 * @param {*} keyID 
 */
function keyOn(keyID) {
    console.log(`key: ${keyID} ON`);

    if (keyID >= 36 && keyID <= 51) {

        BLmatrix = [
            [51, 50, 49, 48],
            [47, 46, 45, 44],
            [43, 42, 41, 40],
            [39, 38, 37, 36],
        ]

        let mult = matrixSearch(BLmatrix, keyID);
        let elev = runCall(gpsLoc.latitude + mToLat(-100 * mult[0]), gpsLoc.longitude + mToLong(-100 * mult[1]));
        document.getElementById(keyID).innerHTML = elev;
        let colorValue = map(userElev, elev);
        colorKeys(keyID, midiColors[6 + colorValue]);
        document.getElementById(keyID).style.backgroundColor = RGBColors[6 + colorValue];

    } else if (keyID >= 52 && keyID <= 67) {

        TLmatrix = [
            [55, 54, 53, 52],
            [59, 58, 57, 56],
            [63, 62, 61, 60],
            [67, 66, 65, 64],
        ]

        let mult = matrixSearch(TLmatrix, keyID);
        let elev = runCall(gpsLoc.latitude + mToLat(100 * mult[0]), gpsLoc.longitude + mToLong(-100 * mult[1]));
        document.getElementById(keyID).innerHTML = elev;
        let colorValue = map(userElev, elev);
        colorKeys(keyID, midiColors[6 + colorValue]);
        document.getElementById(keyID).style.backgroundColor = RGBColors[6 + colorValue];

    } else if (keyID >= 68 && keyID <= 83) {

        BRmatrix = [
            [80, 81, 82, 83],
            [76, 77, 78, 79],
            [72, 73, 74, 75],
            [68, 69, 70, 71],
        ]

        let mult = matrixSearch(BRmatrix, keyID);
        let elev = runCall(gpsLoc.latitude + mToLat(-100 * mult[0]), gpsLoc.longitude + mToLong(100 * mult[1]));
        document.getElementById(keyID).innerHTML = elev;
        let colorValue = map(userElev, elev);
        colorKeys(keyID, midiColors[6 + colorValue]);
        document.getElementById(keyID).style.backgroundColor = RGBColors[6 + colorValue];

    } else if (keyID >= 84 && keyID <= 99) {

        TRmatrix = [
            [84, 85, 86, 87],
            [88, 89, 90, 91],
            [92, 93, 94, 95],
            [96, 97, 98, 99],
        ]

        let mult = matrixSearch(TRmatrix, keyID);
        let elev = runCall(gpsLoc.latitude + mToLat(100 * mult[0]), gpsLoc.longitude + mToLong(100 * mult[1]));
        document.getElementById(keyID).innerHTML = elev;
        let colorValue = map(userElev, elev);
        colorKeys(keyID, midiColors[6 + colorValue]);
        document.getElementById(keyID).style.backgroundColor = RGBColors[6 + colorValue];

    }
}


/**
 * Actions to take on key release
 * @param {*} keyID 
 */
function keyOff(keyID) {
    console.log(`key: ${keyID} OFF`);
}


/**
 * Linear search for matrix
 * @param {*} matrix 
 * @param {*} target 
 * @returns 1-indexed coords
 */
function matrixSearch(matrix, target) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == target) {
                return [i + 1, j + 1];
            }
        }
    }
}


/**
 * jquery.ajax API call to get elevation data at coords
 * @param {*} lat 
 * @param {*} lon 
 * @returns elevation in meters
 */
function runCall(lat, lon) {
    let result = "N/A";

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `https://nationalmap.gov/epqs/pqs.php?y=${lat}&x=${lon}&output=json&units=Meters`,
        async: false,
        crossDomain: true,


        complete: function (response) {
            if (response.readyState == 4 && response.status == 200) {
                let elevation = response.responseJSON.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
                // console.log(`${elevation} meters`);
                result = elevation;
            } else {
                console.log("The readyState and status did not pass, check API call.");
            }
        }
    });

    return result;
}


/**
 * Options for GPS location retrieval
 */
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


/**
 * Actions to take on successful location request
 * @param {*} pos 
 */
function GPSsuccess(pos) {
    var crd = pos.coords;
    gpsLoc = { 'latitude': crd.latitude, 'longitude': crd.longitude };
    console.log('GPS location found!');
}


/**
 * Actions to take on failed location request
 * @param {*} err 
 */
function GPSerror(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


/**
 * Converts a measure in meters to degrees latitude
 * @param {meters} m 
 * @returns 
 */
function mToLat(m) {
    return m / 111111;
}


/**
 * Converts a measure in meters to degrees longitude relative to current latitude
 * @param {meters} m 
 * @returns 
 */
function mToLong(m) {
    return m / (111111 * Math.cos(gpsLoc.latitude * Math.PI / 180));
}


function relDiff(user, current) {
    return (current - user) / user;
}


/**
 * Determines the relative difference between the user elevation and the current node elevation and scales to a color index value accordingly
 * @param {user elevation} user 
 * @param {current node elevation} current 
 * @returns 
 */
function map(user, current) {
    let percent = (current - user) / user;
    return Math.round((percent * 6) / 100);
}