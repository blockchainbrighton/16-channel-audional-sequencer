// eventListeners.js



// Document ready event listener
document.addEventListener("DOMContentLoaded", function() {
    setupSaveButton();
    setupLoadButton();
    setupMessageListener();
    setupPrevSequenceButton();
});

// Setup save button
function setupSaveButton() {
    let saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', handleSaveButtonClick);
}

// Handle save button click
function handleSaveButtonClick() {
    saveCurrentSequence(currentSequence);
    let { settings, filename } = exportSettings();
    let blob = new Blob([settings], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
    console.log(`Saved current sequence to ${filename}`);
}

// Setup load button and file input
function setupLoadButton() {
    let loadButton = document.getElementById('load-button');
    let loadFileInput = document.getElementById('load-file-input');

    loadButton.addEventListener('click', () => {
        console.log("Load sequence button clicked");
        loadFileInput.click();
    });

    loadFileInput.addEventListener('change', handleFileInputChange);
}

// Handle file input change (loading settings)
function handleFileInputChange(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let settings = e.target.result;
        importSettings(settings);
        console.log("Loaded settings from file:", settings);
    };
    reader.readAsText(file);
}

// Setup message event listener
function setupMessageListener() {
    window.addEventListener('message', handleMessageEvent);
}

// Handle messages from external sources
function handleMessageEvent(event) {
    switch (event.data.command) {
        case 'load':
            fetch(event.data.path)
                .then(response => response.json())
                .then(song => loadSong(song));
            break;
        case 'play':
            startScheduler();
            break;
        case 'stop':
            stopScheduler();
            break;
        case 'pause':
            pauseScheduler();
            break;
        default:
            console.warn(`Unknown command received: ${event.data.command}`);
    }
}

// Setup previous sequence button
function setupPrevSequenceButton() {
    document.getElementById('prev-sequence').addEventListener('click', handlePrevSequenceClick);
}

// Handle previous sequence button click
function handlePrevSequenceClick() {
    saveCurrentSequence(currentSequence);
    if (currentSequence > 1) {
        currentSequence--;
        loadSequence(currentSequence);
        updateSequenceDisplay();
        updateActiveQuickPlayButton();
        console.log(`Loaded previous sequence: Sequence ${currentSequence}`);
    } else {
        console.warn("You're already on the first sequence.");
    }
}

// Function to update UI for the current sequence
function updateUIForSequence(sequenceNumber) {
    if (!isValidSequenceNumber(sequenceNumber)) {
        console.error("Invalid sequence number:", sequenceNumber);
        return;
    }

    const sequence = sequences[sequenceNumber - 1];
    if (!sequence || !sequence.channels) {
        console.error("No settings found for sequence number:", sequenceNumber);
        return;
    }

    const sequenceSettings = sequence.channels; // Access the channels property of the sequence

    channels.forEach((channel, index) => {
        if (!sequenceSettings[index]) {
            console.error("No settings found for channel index:", index, "in sequence number:", sequenceNumber);
            return;
        }
        console.log(`channelSettings for index ${index}:`, sequenceSettings[index]);
        updateChannelUI(channel, sequenceSettings[index], index);
    });
}


// Function to check if a sequence number is valid
function isValidSequenceNumber(sequenceNumber) {
    return sequenceNumber > 0 && sequenceNumber <= sequences.length;
}

// Function to update the UI for a channel
function updateChannelUI(channel, channelSettings) {
    const stepButtons = channel.querySelectorAll('.step-button');
    const toggleMuteButtons = channel.querySelectorAll('.toggle-mute');

    clearChannelUI(stepButtons, toggleMuteButtons);
    
    // Extract steps from channelSettings starting from index 0
    const steps = channelSettings.steps;
    for(let i = 0; i < channelSettings.length; i++) {
        steps.push(channelSettings[i]);
    }

    setChannelSteps(stepButtons, steps);
}

// Function to clear the UI for a channel
function clearChannelUI(stepButtons, toggleMuteButtons) {
    stepButtons.forEach(button => button.classList.remove('selected'));
    toggleMuteButtons.forEach(button => button.classList.remove('toggle-mute'));
}

// Function to set the UI for a channel's steps
function setChannelSteps(stepButtons, steps) {
    // console.log(stepButtons);
    steps.forEach((stepState, pos) => {
        if (stepButtons[pos] && stepState) {
            stepButtons[pos].classList.add('selected');
        }
    });
}


// Function to update the sequence display
function updateSequenceDisplay() {
    document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
}

// Event listener for previous sequence button
document.getElementById('prev-sequence').addEventListener('click', handlePrevSequenceClick);
