if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function failure() {
    console.log('Could not connect MIDI');
}

function success(midiAccess) {
    midiAccess.addEventListener('statechange', updateDevices);
    const inputs = midiAccess.inputs;

    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    });
}

function updateDevices(event) {
    console.log(event);
}

function handleInput(input) {
    const command = input.data[0];
    const keyID = input.data[1];
    const type = input.data[2];

    console.log(`command: ${command}, keyID: ${keyID}, type: ${type}`);
}