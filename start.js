// JS file to manage the start button and build the grid for plotting elevations and colors


// layout of MIDI controller for easier assignment of ID
const layout = [
    64, 65, 66, 67, 96, 97, 98, 99,
    60, 61, 62, 63, 92, 93, 94, 95,
    56, 57, 58, 59, 88, 89, 90, 91,
    52, 53, 54, 55, 84, 85, 86, 87,
    48, 49, 50, 51, 80, 81, 82, 83,
    44, 45, 46, 47, 76, 77, 78, 79,
    40, 41, 42, 43, 72, 73, 74, 75,
    36, 37, 38, 39, 68, 69, 70, 71
]


/**
 * Builds the HTML grid of buttons for user interaction to display elevations/colors/coords relative to user position
 * This function is tied to user accepting prompt for user location
 */
function start() {

    try {

        // clearing old elements from last instance
        let mainDiv = document.getElementById("main");
        mainDiv.remove();

        console.log("Cleared old elements...");
    } catch {

        // no elements found to clear
        console.log("Beginning instance...");

    }

    // building main div container for heatmap
    let main = document.createElement("div")
    main.className = "main";
    main.id = "main";
    document.getElementById("body").appendChild(main);

    // building div container for upper half of heatmap grid
    let cont = document.createElement("div")
    cont.className = "grid-container";
    cont.id = "grid-cont-upper";
    document.getElementById("main").appendChild(cont);

    // iteratively building boxes and adding necessary functions
    for (let i = 0; i < 32; i++) {
        let b = document.createElement("button");
        b.className = "box";
        b.id = layout[i];
        b.onclick = function () { keyOn(layout[i]) };
        let node = document.createTextNode(layout[i]);
        b.appendChild(node);

        document.getElementById("grid-cont-upper").appendChild(b);
    }

    // building div container for user location/elevation
    let centerDiv = document.createElement("div")
    centerDiv.className = "center-div";
    centerDiv.id = "center-div";
    document.getElementById("main").appendChild(centerDiv);

    // adding button to center div for user info
    let center = document.createElement("button")
    center.className = "center";
    center.id = "center";
    let centerNode = document.createTextNode("YOUR LOCATION");
    center.appendChild(centerNode);
    document.getElementById("center-div").appendChild(center);

    // building div container for lower half of heatmap grid
    cont = document.createElement("div")
    cont.className = "grid-container";
    cont.id = "grid-cont-lower";
    document.getElementById("main").appendChild(cont);

    // iteratively building boxes and adding necessary functions
    for (let i = 32; i < 64; i++) {
        let b = document.createElement("button");
        b.className = "box";
        b.id = layout[i];
        b.onclick = function () { keyOn(layout[i]) };
        let node = document.createTextNode(layout[i]);
        b.appendChild(node);

        document.getElementById("grid-cont-lower").appendChild(b);
    }

    // try-catch for colorKeys - necessary if MIDI not connected
    try {

        // if MIDI connected, reset color of all keys to 0
        for (let i = 0; i < layout.length; i++) {
            colorKeys(layout[i], 0);
        }

    } catch {

        console.log("No MIDI found, cannot reset key colors...");

    }
}


/**
 * This function is tied to user accepting prompt for user location
 */
function userPos() {
    let elev = runCall(gpsLoc.latitude, gpsLoc.longitude);
    document.getElementById("center").innerHTML = `You: ${elev}`;
    userElev = elev;
}


/**
 * Prompts the user for GPS location
 * If location accepted, then start() and userPos() are called
 * Else alert
 */
function reqLocation() {
    navigator.geolocation.getCurrentPosition(GPSsuccess, GPSerror, options);
}


/**
 * Submits the coordinates entered as inputs rather than using user location
 */
function submitCoords() {
    gpsLoc.latitude = parseFloat(document.getElementById("lat").value);
    gpsLoc.longitude = parseFloat(document.getElementById("lon").value);
    console.log(gpsLoc.latitude, gpsLoc.longitude);
    start();
    userPos();
}