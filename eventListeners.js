document.addEventListener("DOMContentLoaded", function() {
    setupSaveButton();
    setupLoadButton();
    setupMessageListener();
    setupPrevSequenceButton();
});

function setupSaveButton() {
    let saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', handleSaveButtonClick);
}

function handleSaveButtonClick() {
    let { settings, filename } = exportSettings();
    let blob = new Blob([settings], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
}

function setupLoadButton() {
    let loadButton = document.getElementById('load-button');
    let loadFileInput = document.getElementById('load-file-input');

    loadButton.addEventListener('click', () => {
        console.log("Load sequence button clicked");
        loadFileInput.click();
    });

    loadFileInput.addEventListener('change', handleFileInputChange);
}

function handleFileInputChange(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let settings = e.target.result;
        importSettings(settings);
    };
    reader.readAsText(file);
}

function setupMessageListener() {
    window.addEventListener('message', handleMessageEvent);
}

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

function setupPrevSequenceButton() {
    document.getElementById('prev-sequence').addEventListener('click', handlePrevSequenceClick);
}

function handlePrevSequenceClick() {
    if (currentSequence > 1) {
        saveCurrentSequence(currentSequence);
        currentSequence--;
        loadSequence(currentSequence);
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
        updateActiveQuickPlayButton();
    } else {
        console.warn("You're already on the first sequence.");
    }
}


function updateUIForSequence(sequenceNumber) {
    if (!isValidSequenceNumber(sequenceNumber)) {
        console.error("Invalid sequence number:", sequenceNumber);
        return;
    }

    const sequenceSettings = sequences[sequenceNumber - 1];
    if (!sequenceSettings) {
        console.error("No settings found for sequence number:", sequenceNumber);
        return;
    }

    channels.forEach((channel, index) => {
        if (!sequenceSettings[index]) {
            console.error("No settings found for channel index:", index, "in sequence number:", sequenceNumber);
            return;
        }
        console.log("channelSettings for index", index, ":", sequenceSettings[index]);  // Add this line
        updateChannelUI(channel, sequenceSettings[index], index);
    });
}

function isValidSequenceNumber(sequenceNumber) {
    return sequenceNumber > 0 && sequenceNumber <= sequences.length;
}

function updateChannelUI(channel, channelSettings, index) {
    const stepButtons = channel.querySelectorAll('.step-button');
    const toggleMuteButtons = channel.querySelectorAll('.toggle-mute');

    clearChannelUI(stepButtons, toggleMuteButtons);
    
    // Extract steps from channelSettings starting from index 1
    const steps = [];
    for(let i = 1; i < channelSettings.length; i++) {
        steps.push(channelSettings[i]);
    }

    setChannelSteps(stepButtons, steps);
}






function clearChannelUI(stepButtons, toggleMuteButtons) {
    stepButtons.forEach(button => button.classList.remove('selected'));
    toggleMuteButtons.forEach(button => button.classList.remove('toggle-mute'));
}

function setChannelSteps(stepButtons, steps) {
    steps.forEach((stepState, pos) => {
        if (stepState) {
            stepButtons[pos].classList.add('selected');
        }
    });
}

function handlePrevSequenceClick() {
    if (currentSequence > 1) {
        saveCurrentSequence(currentSequence);
        currentSequence--;
        loadSequence(currentSequence);
        updateSequenceDisplay();
        updateActiveQuickPlayButton();
    } else {
        console.warn("You're already on the first sequence.");
    }
}

function updateSequenceDisplay() {
    document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
}

document.getElementById('prev-sequence').addEventListener('click', handlePrevSequenceClick);

