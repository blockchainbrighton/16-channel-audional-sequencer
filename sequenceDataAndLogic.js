//sequenceDataAndLogic.js



// Helper function to set the BPM slider and display
function setBPMForSequence(sequenceNumber) {
    console.log(`Setting BPM for Sequence ${sequenceNumber}`);
    let bpm = sequenceBPMs[sequenceNumber - 1];
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input'));
    console.log(`BPM for Sequence ${sequenceNumber} set to ${bpm}`);
}

// Helper function to load audio for a channel
function loadAudioForChannel(channelIndex) {
    console.log(`Loading audio for Channel ${channelIndex + 1}`);
    const currentUrl = urlsForSequence[channelIndex];
    const channelElement = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    const previousUrl = channelElement.dataset.originalUrl;

    if (currentUrl && currentUrl !== previousUrl) {
        const loadSampleButton = channelElement.querySelector('.load-sample-button');
        fetchAudio(currentUrl, channelIndex, loadSampleButton);
        console.log(`Audio loaded for Channel ${channelIndex + 1} from URL: ${currentUrl}`);
    } else {
        console.log(`No audio changes for Channel ${channelIndex + 1}`);
    }
}

function loadSequence(sequenceNumber) {
    console.log(`Loading Sequence ${sequenceNumber}`);
    setBPMForSequence(sequenceNumber);

    const sequence = sequences[sequenceNumber - 1];
    if (!sequence) {
        console.error(`Sequence ${sequenceNumber} is not found in sequences.`, sequences);
        return;
    }

    const sequenceChannels = sequence.channels;
    if (!Array.isArray(sequenceChannels)) {
        console.error(`Channels for Sequence ${sequenceNumber} are not an array.`, sequenceChannels);
        return;
    }


    console.log(`Loaded settings for Sequence ${sequenceNumber}:`, sequenceChannels);

    updateUIForSequence(sequenceNumber);
    currentSequence = sequenceNumber;

    sequenceChannels.forEach((_, channelIndex) => {
        loadAudioForChannel(channelIndex);
    });

    console.log(`Sequence ${sequenceNumber} loaded successfully.`);
}

function loadNextSequence() {
    if (currentSequence < totalSequenceCount) {
        console.log(`Loading next Sequence: ${currentSequence + 1}`);
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
