if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
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

    for (var output of midiAccess.outputs.values()) {
        device = output;
    }

    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    });
}


function colorKeys(key, color) {
    device && device.send([0x90, key, color]);
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