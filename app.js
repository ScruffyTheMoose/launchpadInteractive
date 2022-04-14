if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

navigator.geolocation.getCurrentPosition(GPSsuccess, GPSerror, options);
gpsLoc = {};


/**
 * Scales a ratio value
 * @param {input numerator} input_num 
 * @param {input denominator} input_denom 
 * @param {output denominator} output_denom 
 * @returns 
 */
function map(input_num, input_denom, output_denom) {
    return (input_num * output_denom) / input_denom;
}


/**
 * Indicates error connecting to MIDI
 */
function failure() {
    console.log('Could not connect MIDI');
}


/**
 * Input handling for MIDI if successfully connected
 * @param {*} midiAccess 
 */
function success(midiAccess) {
    midiAccess.addEventListener('statechange', updateDevices);
    const inputs = midiAccess.inputs;

    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    });
}


/**
 * Listens for events
 * @param {*} event 
 */
function updateDevices(event) {
    console.log(event);
}


/**
 * Action to take on recieved input from MIDI
 * @param {*} input 
 */
function handleInput(input) {
    const command = input.data[0];
    const keyID = input.data[1];
    const type = input.data[2];

    console.log(`command: ${command}, keyID: ${keyID}, type: ${type}`);

    switch (command) {
        case 144:
            if (type != 0) {
                keyOn(keyID);
            } else {
                keyOff(keyID);
            }
            break;
    }
}

// each matrix is in order so that the referenced number will represent the row, column movement
// use linear search to find the key ID pressed, and then convert to lat/lon accordingly
TRmatrix = [
    [84, 85, 86, 87],
    [88, 89, 90, 91],
    [92, 93, 94, 95],
    [96, 97, 98, 99],
]

TLmatrix = [
    [55, 54, 53, 52],
    [59, 58, 57, 56],
    [63, 62, 61, 60],
    [67, 66, 65, 64],
]

BRmatrix = [
    [80, 81, 82, 83],
    [76, 77, 78, 79],
    [72, 73, 74, 75],
    [68, 69, 70, 71],
]

BLmatrix = [
    [51, 50, 49, 48],
    [47, 46, 45, 44],
    [43, 42, 41, 40],
    [39, 38, 37, 36],
]


function keyOn(keyID) {
    console.log(`key: ${keyID} ON`);

    switch (keyID) {
        case 55:
            runCall(gpsLoc.latitude + mToLat(100), gpsLoc.longitude + mToLong(-100));
            break;

        case 84:
            runCall(gpsLoc.latitude + mToLat(100), gpsLoc.longitude + mToLong(100));
            break;

        case 51:
            runCall(gpsLoc.latitude + mToLat(-100), gpsLoc.longitude + mToLong(-100));
            break;

        case 80:
            runCall(gpsLoc.latitude + mToLat(-100), gpsLoc.longitude + mToLong(100));
            break;
    };
}


function keyOff(keyID) {
    console.log(`key: ${keyID} OFF`);
}


function linearSearch(matrix, target) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == target) {
                return [i, j];
            }
        }
    }
}


function runCall(lat, lon) {

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `https://nationalmap.gov/epqs/pqs.php?y=${lat}&x=${lon}&output=json&units=Meters`,
        async: false,
        crossDomain: true,


        complete: function (response) {
            if (response.readyState == 4 && response.status == 200) {
                console.log(`${response.responseJSON.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation} meters`);
            } else {
                console.log("The readyState and status did not pass, check API call.");
            }
        }
    })
}


var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function GPSsuccess(pos) {
    var crd = pos.coords;
    gpsLoc = { 'latitude': crd.latitude, 'longitude': crd.longitude };
    console.log('GPS location found!');
}

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