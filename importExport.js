// importExport.js

const EMPTY_CHANNEL = {
    "triggers": [],
    "mute": false,
    "toggleMuteSteps": [],
    "url": ""
};

let sequenceBPMs = Array(totalSequenceCount).fill(105);
let urlsForSequence = []; // New array to store URLs


// Process a channel in the sequenceData
function processChannel(sequenceData, channelIndex) {
    console.log(`Processing channel at index: ${channelIndex}`);
    const channelStepsData = sequenceData[channelIndex] || [];
    const url = channels[channelIndex] && channels[channelIndex].dataset ? channels[channelIndex].dataset.originalUrl : "";
    const stepTriggers = [];

    channelStepsData.forEach((stepState, stepIndex) => {
        if (stepState && stepIndex !== 0) {
            stepTriggers.push(stepIndex);
        }
    });

    const mute = channels[channelIndex] && channels[channelIndex].dataset ? channels[channelIndex].dataset.muted === 'true' : false;

    console.log(`Processed channel data for index ${channelIndex}:`, {
        triggers: stepTriggers,
        mute: mute,
        url: url
    });

    return {
        triggers: stepTriggers,
        mute: mute,
        toggleMuteSteps: [],
        url: url
    };
}

// Export settings to JSON
function exportSettings() {
    console.log("Exporting settings...");
    const allSequencesSettings = sequences.map((sequenceData, seqIndex) => {
        const settings = {
            name: `Sequence_${seqIndex + 1}`,
            bpm: sequenceBPMs[seqIndex],
            channels: []
        };

        for (let i = 0; i < 16; i++) {
            const channelData = processChannel(sequenceData, i);
            settings.channels.push(channelData);
        }

        return settings;
    });

    const filename = `audiSeq_AllSequences.json`;
    console.log("Exported settings:", allSequencesSettings);
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename: filename };
}

// // Check if a sequence is valid
// function isValidSequence(seq) {
//     return seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
// }

// Convert sequence settings
function convertSequenceSettings(seqSettings) {
    console.log("Converting sequence settings...");
    let channels = seqSettings.channels;
    if (channels.length < 16) {
        let emptyChannelsToAdd = 16 - channels.length;
        for (let i = 0; i < emptyChannelsToAdd; i++) {
            channels.push(EMPTY_CHANNEL);
        }
    }

    return channels.map(ch => convertChannelToStepSettings(ch));
}

// Convert channel settings to step settings
function convertChannelToStepSettings(channel) {
    console.log("Converting channel to step settings...");
    let stepSettings = Array(64).fill(false); // Removed channel.url from here

    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });

    return stepSettings;
}

// Update BPM slider and display
function updateBPM(bpm) {
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input'));
}

// Import settings from JSON
function importSettings(settings) {
    console.log("Importing settings...");
    let parsedSettings;
    let sequenceNames = [];

    try {
        parsedSettings = JSON.parse(settings);
    } catch (error) {
        console.error("Error parsing settings:", error);
        return;
    }

    if (parsedSettings.urls && Array.isArray(parsedSettings.urls)) {
        collectedURLs = collectedURLs.concat(parsedSettings.urls);
    }

    if (!Array.isArray(parsedSettings)) {
        parsedSettings = [parsedSettings];
    }

    let importedSequences = parsedSettings.map(seqSettings => {
        sequenceNames.push(seqSettings.name);
        sequenceBPMs.push(seqSettings.bpm || 0);
        updateBPM(seqSettings.bpm);
        
        // Populate the urlsForSequence array
        urlsForSequence.push(...seqSettings.channels.map(ch => ch.url));
        
        const convertedSettings = convertSequenceSettings(seqSettings);
        console.log("Converted Settings:", convertedSettings);
        return convertedSettings;
    }).filter(Boolean);

    console.log("Imported sequences after processing:", importedSequences);
    console.log("Extracted sequence names:", sequenceNames);
    console.log("Updated sequenceBPMs:", sequenceBPMs);
    console.log("URLs for Sequences:", urlsForSequence); // Log the URLs for debugging

    return importedSequences;
}
