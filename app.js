if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function failure() {
    console.log('Could not connect MIDI');
}

function succes(midiAccess) {
    console.log(midiAccess);
}