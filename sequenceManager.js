// sequenceManager.js

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

let sequences = Array(totalSequenceCount).fill().map((_, index) => createSequence(`Sequence ${index + 1}`, 120));
console.log("Sequences initialized:", sequences);

let channelSettings = sequences[currentSequence - 1].channels;

function onSequenceOrDataChange() {
    channelSettings = sequences[currentSequence - 1].channels;
    console.log(`Settings for Current Sequence (${currentSequence}) after data change:`, channelSettings);
}

function addURLsToSequenceArrays(urls) {
    urls.forEach((url, index) => {
        sequences[currentSequence - 1].channels[index].url = url;
    });
    console.log(`URLs added to Sequence ${currentSequence}:`, urls);
}

function changeSequence(seq) {
    currentSequence = seq;
    onSequenceOrDataChange();
    console.log(`Changed to Sequence ${seq}`);
}

function saveCurrentSequence(sequenceNumber) {
    console.log(`Entering saveCurrentSequence for Sequence ${sequenceNumber}`);
    sequences[sequenceNumber - 1].channels = channelSettings.map(channel => ({
        ...channel
    }));
    console.log(`Saved channel settings for Sequence ${sequenceNumber}:`, channelSettings);
}

function loadChannelSettingsFromPreset(preset) {
    console.log("Before loading preset:", JSON.stringify(channelSettings));

    preset.channels.forEach((channelData, channelIndex) => {
        channelData.triggers.forEach(trigger => {
            channelSettings[channelIndex].steps[trigger] = true;
        });
        
        if (channelData.url) {
            channelSettings[channelIndex].url = channelData.url;
        }
    });

    console.log(`Loaded channel settings from preset for Sequence ${currentSequence}`);
}

function getChannelSettings(channelIndex) {
    return channelSettings[channelIndex].steps;
}

function setChannelSettings(channelIndex, settings) {
    channelSettings[channelIndex].steps = settings;
    console.log(`Set step settings for Channel ${channelIndex + 1}:`, settings);
}
