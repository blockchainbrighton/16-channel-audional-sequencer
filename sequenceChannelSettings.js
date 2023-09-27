// sequenceChannelSettings.js

let currentSequence = 1;
let totalSequenceCount = 64;

function createChannel() {
    return {
        steps: [null].concat(Array(64).fill(false)),
        url: ''
    };
}

// Create an initial state for all 16 channels
let channelSettings = Array(16).fill().map(createChannel);
let sequences = Array(totalSequenceCount).fill().map(() => Array(16).fill().map(createChannel));

// A function to be called whenever the sequence changes or JSON data is loaded
function onSequenceOrDataChange() {
    channelSettings = Array(16).fill().map(createChannel);
    console.log(`Settings for Current Sequence (${currentSequence}) after data change:`, channelSettings);
}

// Function to add URLs to our structure
function addURLsToSequenceArrays(urls) {
    urls.forEach((url, index) => {
        sequences[currentSequence - 1][index].url = url;
    });
}

function changeSequence(seq) {
    currentSequence = seq;
    onSequenceOrDataChange();
}

// Log initial channel settings
console.log("Initial channel settings:", channelSettings);

function loadChannelSettingsFromPreset(preset) {
    preset.channels.forEach((channelData, channelIndex) => {
        channelData.triggers.forEach(trigger => {
            channelSettings[channelIndex].steps[trigger] = true;
        });
        
        if (channelData.url) {
            channelSettings[channelIndex].url = channelData.url;
            const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"] .load-sample-button`);
            fetchAudio(channelData.url, channelIndex, loadSampleButton);
        }
    });

    saveCurrentSequence(currentSequence);
}

function updateStep(channelIndex, stepIndex, state) {
    channelSettings[channelIndex].steps[stepIndex + 1] = state;
}

function getChannelSettings(channelIndex) {
    return channelSettings[channelIndex].steps;
}

function setChannelSettings(channelIndex, settings) {
    channelSettings[channelIndex].steps = settings;
}

function saveCurrentSequence(sequenceNumber) {
    sequences[sequenceNumber - 1] = channelSettings.map(channel => ({
        steps: [...channel.steps],
        url: channel.url
    }));
}

document.getElementById('next-sequence').addEventListener('click', loadNextSequence);
