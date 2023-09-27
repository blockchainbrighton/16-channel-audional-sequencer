//sequenceDataAndLogic.js

// Helper function to initialize a sequence if it doesn't exist
function initializeSequence(sequenceNumber) {
    if (!sequences[sequenceNumber - 1]) {
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }
}

// Helper function to set the BPM slider and display
function setBPMForSequence(sequenceNumber) {
    let bpm = sequenceBPMs[sequenceNumber - 1];
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input'));
}

// Helper function to load audio for a channel
function loadAudioForChannel(channelData, channelIndex) {
    const currentUrl = channelData[0];
    const channelElement = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    const previousUrl = channelElement.dataset.originalUrl;

    if (currentUrl && currentUrl !== previousUrl) {
        const loadSampleButton = channelElement.querySelector('.load-sample-button');
        fetchAudio(currentUrl, channelIndex, loadSampleButton);
    }
}

function loadSequence(sequenceNumber) {
    initializeSequence(sequenceNumber);
    setBPMForSequence(sequenceNumber);

    const sequenceChannels = sequences[sequenceNumber - 1];
    if (!sequenceChannels) {
        console.error(`Sequence ${sequenceNumber} is not found in sequences.`, sequences);
        return;
    }

    if (!Array.isArray(sequenceChannels)) {
        console.error(`Sequence ${sequenceNumber} is not an array.`, sequenceChannels);
        return;
    }

    const urlsForSequence = sequenceChannels.map(channelData => channelData[0]);
    console.log(`URLs for Sequence ${sequenceNumber}:`, urlsForSequence);
    console.log(`Loaded settings for Sequence ${sequenceNumber}:`, sequenceChannels);

    updateUIForSequence(sequenceNumber);
    currentSequence = sequenceNumber;

    sequenceChannels.forEach((channelData, channelIndex) => {
        loadAudioForChannel(channelData, channelIndex);
    });
}

function loadNextSequence() {
    if (currentSequence < totalSequenceCount) {
        saveCurrentSequence(currentSequence);
        currentSequence++;
        loadSequence(currentSequence);

        const sequenceDisplayElement = document.getElementById('current-sequence-display');
        if (sequenceDisplayElement) {
            sequenceDisplayElement.textContent = 'Sequence ' + currentSequence;
        }
        
        updateActiveQuickPlayButton();
    } else {
        console.warn("You've reached the last sequence.");
    }
}
