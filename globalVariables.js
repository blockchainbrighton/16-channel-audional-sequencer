// globalVariables.js

// globalVariables.js

const SequencerGlobals = {
    isPlaying: false,
    currentStep: 0,
    totalStepCount: 0,
    beatCount: 1, // individual steps
    barCount: 1, // bars
    sequenceCount: 1, // sequences
    timeoutId: null,
    isPaused: false, // a flag to indicate if the sequencer is paused
    pauseTime: 0,  // tracks the total paused time
    stopClickCount: 0,
    playButton: document.getElementById('play'),
    stopButton: document.getElementById('stop'),
    saveButton: document.getElementById('save-button'),
    loadButton: document.getElementById('load-button'),
    bpm: 105,
    audioContext: null,
    currentStepTime: null,
    startTime: null,
    nextStepTime: null,
    stepDuration: null,
    gainNodes: [],
    isMuted: false,
    channelMutes: [], // Declare the channelMutes array as a global variable
    muteState: false,
    sequenceLength: 64,
    audioBuffers: new Map(),
    channels: document.querySelectorAll('.channel')
};

export default SequencerGlobals;
