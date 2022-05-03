// base case data for user
// navigator.geolocation.getCurrentPosition(GPSsuccess, GPSerror, options);
gpsLoc = {};
userElev = 0;

const distMult = 800;


// Color arrays for Midi and associated RGB values for on screen display
// color arrays structured as such -> [l, l, l, l ,l, l, 0, g, g, g, g, g, g]
// to index using the color value mapMIDIping function, use -> array[6 + colorValue]
const midiColors = [11, 10, 7, 6, 5, 4, 3, 17, 25, 33, 41, 49, 57];


/**
 * Actions to take on key press
 * @param {*} keyID 
 */
function keyOn(keyID) {

    // logs which key pressed
    console.log(`key: ${keyID} ON`);

    // checks 3rd quadrant of MIDI
    if (keyID >= 36 && keyID <= 51) {

        // matrix of key IDs for quadrant
        BLmatrix = [
            [51, 50, 49, 48],
            [47, 46, 45, 44],
            [43, 42, 41, 40],
            [39, 38, 37, 36],
        ]

        // basic linear search since matrix is small
        let mult = matrixSearch(BLmatrix, keyID);
        // API call to get elevation data based key and relative distance from user position
        let elev = runCall(gpsLoc.latitude + mToLat(-distMult * mult[0]), gpsLoc.longitude + mToLong(-distMult * mult[1]));
        // setting inner text to elevation
        document.getElementById(keyID).innerHTML = elev;
        // using mapMIDI function to determine color value for both button and MIDI key
        let colorValue = mapMIDI(userElev, elev);

        // try-catch necessary if MIDI not connected
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(keyID, midiColors[6 + colorValue]);

        } catch {

            console.log("No MIDI found, no keys to color...");

        }

        // setting button color on screen
        document.getElementById(keyID).style.backgroundColor = mapButtons(userElev, elev);

        // checks 2nd quadrant of MIDI
    } else if (keyID >= 52 && keyID <= 67) {

        // matrix of key IDS for quadrant
        TLmatrix = [
            [55, 54, 53, 52],
            [59, 58, 57, 56],
            [63, 62, 61, 60],
            [67, 66, 65, 64],
        ]

        // basic linear search since matrix is small
        let mult = matrixSearch(TLmatrix, keyID);
        // API call to get elevation data based key and relative distance from user position
        let elev = runCall(gpsLoc.latitude + mToLat(distMult * mult[0]), gpsLoc.longitude + mToLong(-distMult * mult[1]));
        // setting inner text to elevation
        document.getElementById(keyID).innerHTML = elev;
        // using mapMIDI function to determine color value for both button and MIDI key
        let colorValue = mapMIDI(userElev, elev);

        // try-catch necessary if MIDI not connected
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(keyID, midiColors[6 + colorValue]);

        } catch {

            console.log("No MIDI found, no keys to color...");

        }

        // setting button color on screen
        document.getElementById(keyID).style.backgroundColor = mapButtons(userElev, elev);

        // checks 4th quadrant of MIDI
    } else if (keyID >= 68 && keyID <= 83) {

        // matrix of key IDS for quadrant
        BRmatrix = [
            [80, 81, 82, 83],
            [76, 77, 78, 79],
            [72, 73, 74, 75],
            [68, 69, 70, 71],
        ]

        // basic linear search since matrix is small
        let mult = matrixSearch(BRmatrix, keyID);
        // API call to get elevation data based key and relative distance from user position
        let elev = runCall(gpsLoc.latitude + mToLat(-distMult * mult[0]), gpsLoc.longitude + mToLong(distMult * mult[1]));
        // setting inner text to elevation
        document.getElementById(keyID).innerHTML = elev;
        // using mapMIDI function to determine color value for both button and MIDI key
        let colorValue = mapMIDI(userElev, elev);

        // try-catch necessary if MIDI not connected
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(keyID, midiColors[6 + colorValue]);

        } catch {

            console.log("No MIDI found, no keys to color...");

        }

        // setting button color on screen
        document.getElementById(keyID).style.backgroundColor = mapButtons(userElev, elev);

        // checks 1st quadrant of MIDI
    } else if (keyID >= 84 && keyID <= 99) {

        // matrix of key IDS for quadrant
        TRmatrix = [
            [84, 85, 86, 87],
            [88, 89, 90, 91],
            [92, 93, 94, 95],
            [96, 97, 98, 99],
        ]

        // basic linear search since matrix is small
        let mult = matrixSearch(TRmatrix, keyID);
        // API call to get elevation data based key and relative distance from user position
        let elev = runCall(gpsLoc.latitude + mToLat(distMult * mult[0]), gpsLoc.longitude + mToLong(distMult * mult[1]));
        // setting inner text to elevation
        document.getElementById(keyID).innerHTML = elev;
        // using mapMIDI function to determine color value for both button and MIDI key
        let colorValue = mapMIDI(userElev, elev);

        // try-catch necessary if MIDI not connected
        try {

            // assigns color value to MIDI key that was pressed
            colorKeys(keyID, midiColors[6 + colorValue]);

        } catch {

            console.log("No MIDI found, no keys to color...");

        }

        // setting button color on screen
        document.getElementById(keyID).style.backgroundColor = mapButtons(userElev, elev);

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
    start();
    userPos();
}


/**
 * Actions to take on failed location request
 * @param {*} err 
 */
function GPSerror(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert("If you wish to use your current location, you must allow location services!");
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


/**
 * Determines the relative difference between the user elevation and the current node elevation and scales to a color index value accordingly
 * @param {user elevation} user 
 * @param {current node elevation} current 
 * @returns 
 */
function mapMIDI(user, current) {
    let percent = ((current - user) / user) % 1;
    return Math.round((percent * 6));
}


function mapButtons(user, current) {

    // percentage relative difference between user location and current location
    let percent = ((current - user) / user) % 1;
    // converted percentage to rgb scale
    rgbPrimary = Math.abs(Math.round((percent * 255)));
    rgbSecondary = Math.abs(Math.round((percent * 50)));

    if (current < user) {
        return `rgb(0, ${rgbSecondary}, ${rgbPrimary})`;
    } else {
        return `rgb(${rgbPrimary}, 0, 0)`;
    }
}