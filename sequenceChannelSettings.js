// sequenceChannelSettings.js

let currentSequence = 1;


// Create an initial state for all 16 channels, with 64 steps each set to 'off' (false) plus a placeholder at the 0th index
var channelSettings = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));


// We'll start with one sequence (sequence 1) 
var sequences = [channelSettings];


// Log initial channel settings
console.log("Initial channel settings:", channelSettings);


function loadChannelSettingsFromPreset(preset) {
    preset.channels.forEach((channelData, channelIndex) => {
        let stepSettings = [null].concat(Array(64).fill(false));  // Add placeholder for 0th index
        channelData.triggers.forEach(trigger => {
            // Account for 1-indexing
            stepSettings[trigger] = true;
        });
        channelSettings[channelIndex] = stepSettings;
        console.log(`Loaded settings for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
    });

    // Save the loaded preset to the current sequence
    saveCurrentSequence(sequenceCount);
}


/**
 * Updates a specific step's state for a given channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @param {number} stepIndex - The index of the step (0 to 63).
 * @param {boolean} state - The new state of the step (true for on, false for off).
 */
function updateStep(channelIndex, stepIndex, state) {
    // Account for 1-indexing
    channelSettings[channelIndex][stepIndex + 1] = state;
    
    // Log updated settings for the specific channel after the update
    console.log(`Updated settings for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
}

/**
 * Gets the current settings for a specific channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @returns {Array} An array of 64 boolean values representing the step button states for the given channel.
 */
function getChannelSettings(channelIndex) {
    return channelSettings[channelIndex];
}

/**
 * Sets the settings for a specific channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @param {Array} settings - An array of 64 boolean values representing the step button states.
 */
function setChannelSettings(channelIndex, settings) {
    channelSettings[channelIndex] = settings;
    
    // Log the settings for the specific channel after they are set
    console.log(`Settings set for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
}

function saveCurrentSequence(sequenceNumber) {
    // If the sequence doesn't exist in the sequences array, initialize it
    if (!sequences[sequenceNumber - 1]) {
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }
    // Copy the current channel settings to the sequence
    sequences[sequenceNumber - 1] = JSON.parse(JSON.stringify(channelSettings));
    console.log(`Saved settings for Sequence ${sequenceNumber}:`, sequences[sequenceNumber - 1]);
}



function loadSequence(sequenceNumber) {
    if (!sequences[sequenceNumber - 1]) {
        // If the sequence doesn't exist, initialize it with default settings
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }
    channelSettings = sequences[sequenceNumber - 1];
    console.log(`Loaded settings for Sequence ${sequenceNumber}:`, channelSettings);

    // Update the UI to reflect the loaded sequence
    updateUIForSequence(sequenceNumber);
}

function loadNextSequence() {
    if (currentSequence < maxSequenceCount) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Increment the current sequence number
        currentSequence++;

        // Load the next sequence's settings
        loadSequence(currentSequence);

        // Update the display
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
    } else {
        console.warn("You've reached the last sequence.");
    }
}


function updateUIForSequence(sequenceNumber) {
    const sequenceSettings = sequences[sequenceNumber - 1];
    channels.forEach((channel, index) => {
        const stepButtons = channel.querySelectorAll('.step-button');
        const toggleMuteButtons = channel.querySelectorAll('.toggle-mute');

        // Clear all step buttons and toggle mute states
        stepButtons.forEach(button => button.classList.remove('selected'));
        toggleMuteButtons.forEach(button => button.classList.remove('toggle-mute'));

        // Update the steps based on the sequence settings
        sequenceSettings[index].forEach((stepState, pos) => {
            // Skip the 0th position (our placeholder)
            if (pos === 0) return;

            if (stepState) {
                stepButtons[pos - 1].classList.add('selected');
            }
        });

        // You can add similar logic for updating other UI elements like toggle mute states, volume, etc.
    });
}

document.getElementById('prev-sequence').addEventListener('click', function() {
    if (currentSequence > 1) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Decrement the current sequence number
        currentSequence--;

        // Load the previous sequence's settings
        loadSequence(currentSequence);
        
        // Update the display
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
    } else {
        console.warn("You're already on the first sequence.");
    }
});

document.getElementById('next-sequence').addEventListener('click', function() {
    if (currentSequence < maxSequenceCount) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Increment the current sequence number
        currentSequence++;

        // Load the next sequence's settings
        loadSequence(currentSequence);

        // Update the display
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
    } else {
        console.warn("You're already on the last sequence.");
    }
});

