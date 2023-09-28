// sequenceChannelSettings.js

let currentSequence = 1;
let totalSequenceCount = 64;

function createChannel() {
    return {
        url: '',
        mute: false,
        toggleMute: Array(64).fill(false),
        steps: Array(64).fill(false),
        volume: 1.0, // default volume
        effects: {} // default empty effects
    };
}

function createSequence(name, bpm) {
    return {
        name: name,
        bpm: bpm,
        channels: Array(16).fill().map(createChannel)
    };
}

function saveCurrentSequence(sequenceNumber) {
    console.log(`Entering saveCurrentSequence for Sequence ${sequenceNumber}`);
    sequences[sequenceNumber - 1].channels = channelSettings.map(channel => ({
        ...channel
    }));
    console.log(`Saved channel settings for Sequence ${sequenceNumber}:`, channelSettings);
}


// Create an initial state for all sequences
let sequences = Array(totalSequenceCount).fill().map((_, index) => createSequence(`Sequence ${index + 1}`, 120));

// Reference to the current sequence's channels for easy access
let channelSettings = sequences[currentSequence - 1].channels;

// A function to be called whenever the sequence changes or JSON data is loaded
function onSequenceOrDataChange() {
    channelSettings = sequences[currentSequence - 1].channels;
    console.log(`Settings for Current Sequence (${currentSequence}) after data change:`, channelSettings);
}

// // Function to add URLs to our structure
// function addURLsToSequenceArrays(urls) {
//     urls.forEach((url, index) => {
//         sequences[currentSequence - 1].channels[index].url = url;
//     });
//     console.log(`URLs added to Sequence ${currentSequence}:`, urls);
// }

function changeSequence(seq) {
    currentSequence = seq;
    onSequenceOrDataChange();
    console.log(`Changed to Sequence ${seq}`);
}

// Log initial channel settings
console.log("Initial channel settings:", channelSettings);



function updateStep(channelIndex, stepIndex, state) {
    if (!channelSettings[channelIndex]) {
        console.error(`Channel settings not found for channel index: ${channelIndex}`);
        return;
    }
    if (!Array.isArray(channelSettings[channelIndex])) {  // Adjusted this line
        console.error(`Steps for channel index ${channelIndex} is not an array.`, channelSettings[channelIndex]);
        return;
    }
    channelSettings[channelIndex][stepIndex] = state;  // Adjusted this line
    console.log(`Updated step (${stepIndex}) for Channel ${channelIndex + 1} to ${state}`);
}


function getChannelSettings(channelIndex) {
    return channelSettings[channelIndex].steps;
}

function setChannelSettings(channelIndex, settings) {
    channelSettings[channelIndex].steps = settings;
    console.log(`Set step settings for Channel ${channelIndex + 1}:`, settings);
}



document.getElementById('next-sequence').addEventListener('click', loadNextSequence);

function setupMuteButtonForChannel(channel, index) {
    const muteButton = channel.querySelector('.mute-button');
    muteButton.addEventListener('click', () => {
        const isSoloed = soloedChannels[index];
        
        // If the channel is currently soloed, unsolo it before muting
        if (isSoloed) {
            soloedChannels[index] = false;
            soloButton.classList.remove('selected');
        }

        // Update mute state after addressing solo state
        const currentMuteState = channel.dataset.muted === 'true';
        updateMuteState(channel, !currentMuteState);
        console.log(`Channel-${index + 1} channels.forEach just toggled updateMuteState`);
    });
}

function createStepButtonsForChannel(channel, channelIndex) {
    const stepsContainer = channel.querySelector('.steps-container');
    stepsContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 64; i++) {
        const button = document.createElement('button');
        button.classList.add('step-button');
        
        button.addEventListener('click', () => {
            button.classList.toggle('selected');

            // Update the step's state in the channelSettings
            let stepState = button.classList.contains('selected');
            updateStep(channelIndex, i, stepState);
        });

        fragment.appendChild(button);
    }

    stepsContainer.appendChild(fragment);
}


// No need to export since it's in the global scope
