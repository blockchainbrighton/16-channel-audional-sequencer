//sequenceDataAndLogic.js

function updateSequenceData(callback) {
    const sequenceData = jsonData[currentSequence - 1];
    if (sequenceData) {
        callback(sequenceData);
    }
}

function updateChannelSettingsForSequence() {
    updateSequenceData((sequenceData) => {
        sequenceData.channels.forEach((channel, index) => {
            channel.triggers.forEach(trigger => {
                channelSettings[index][trigger] = true; // set the trigger step to 'on'
            });
        });
    });
}

function updateChannelURLsForSequence() {
    updateSequenceData((sequenceData) => {
        sequenceData.channels.forEach((channel, index) => {
            channelURLs[currentSequence - 1][index] = channel.url;
        });
    });
}

function loadSequence(sequenceNumber) {
    // If the sequence doesn't exist, initialize it with default settings
    if (!sequences[sequenceNumber - 1]) {
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }
  

    // Set the BPM slider and display to match the current sequence's BPM
    let bpm = sequenceBPMs[sequenceNumber - 1];  // Get the BPM for the current sequence
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input')); // Update the sequencer's BPM

    
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

    // Loaded settings for Sequence
    console.log(`Loaded settings for Sequence ${sequenceNumber}:`, sequenceChannels);

    // Update the UI to reflect the loaded sequence
    updateUIForSequence(sequenceNumber);

    // Update the currentSequence
    currentSequence = sequenceNumber;

    sequenceChannels.forEach((channelData, channelIndex) => {
        const currentUrl = channelData[0]; // Assuming the URL is at the 0th index of channelData array
        const channelElement = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
        const previousUrl = channelElement.dataset.originalUrl;

        if (currentUrl && currentUrl !== previousUrl) {
            const loadSampleButton = channelElement.querySelector('.load-sample-button');
            fetchAudio(currentUrl, channelIndex, loadSampleButton);
        }
    });
}





function loadNextSequence() {
    if (currentSequence < totalSequenceCount) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Increment the current sequence number
        currentSequence++;

        // Load the next sequence's settings
        loadSequence(currentSequence);

        // Update the displayed number
        const sequenceDisplayElement = document.getElementById('current-sequence-display');
        if (sequenceDisplayElement) {
            sequenceDisplayElement.textContent = 'Sequence ' + currentSequence;
        }
        
        updateActiveQuickPlayButton();
    } else {
        console.warn("You've reached the last sequence.");
    }
}