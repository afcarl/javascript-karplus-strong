function String(audioCtx, octave, semitone) {
    this.audioCtx = audioCtx;
    this.basicHz = String.C0_HZ * Math.pow(2, octave+semitone/12);
}

// work from A0 as a reference,
// since it has a nice round frequency
String.A0_HZ = 27.5;
// an increase in octave by 1 doubles the frequency
// each octave is divided into 12 semitones
// the scale goes C0, C0#, D0, D0#, E0, F0, F0#, G0, G0#, A0, A0#, B0
// so go back 9 semitones to get to C0
String.C0_HZ = String.A0_HZ * Math.pow(2, -9/12);

String.prototype.pluck = function(absTime) {
    console.log("Plucking string with frequency " + this.basicHz + 
                " at " + absTime);
    var bufferSource = audioCtx.createBufferSource();
    bufferSource.buffer = getSineWaveBuffer();
    bufferSource.connect(audioCtx.destination);
    bufferSource.start(absTime);

    function createBuffer() {
        var channels = 1;
        // 1 second buffer
        var frameCount = this.audioCtx.sampleRate;
        var sampleRate = this.audioCtx.sampleRate;
        var buffer = this.audioCtx.createBuffer(channels, frameCount, sampleRate);
        return buffer;
    }

    function getSineWaveBuffer() {
        var buffer = createBuffer();
        var bufferChannelData = buffer.getChannelData(0);
        for (var i = 0; i < frameCount; i++) {
            bufferChannelData[i] = Math.sin(2 * Math.PI * this.basicHz * i/sampleRate);
        }
        return buffer;
    }
}

function Guitar(audioCtx) {
    this.strings = [
        new String(audioCtx, 2, 4),   // E2
        new String(audioCtx, 2, 9),   // A2
        new String(audioCtx, 3, 2),   // D3
        new String(audioCtx, 3, 7),   // G3
        new String(audioCtx, 3, 11),  // B3
        new String(audioCtx, 4, 4)    // E4
    ]
}

// webkitAudioContext for Webkit browsers
// AudioContext for Firefox
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var guitar = new Guitar(audioCtx);
var startTime = audioCtx.currentTime;
for (i = 0; i < 6; i++) {
    guitar.strings[i].pluck(startTime + i);
}
