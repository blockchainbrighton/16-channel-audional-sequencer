// importExport.js

const EMPTY_CHANNEL = {
    "triggers": [],
    "mute": false,
    "toggleMuteSteps": [],
    "url": ""
};

let sequenceBPMs = Array(totalSequenceCount).fill(105);

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

function isValidSequence(seq) {
    return seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
}

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

function convertChannelToStepSettings(channel) {
    console.log("Converting channel to step settings...");
    let stepSettings = [channel.url].concat(Array(64).fill(false));

    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });

    return stepSettings;
}

function updateBPM(bpm) {
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input'));
}

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

    sequences = parsedSettings.map(seqSettings => {
        if (isValidSequence(seqSettings)) {
            sequenceNames.push(seqSettings.name);
            sequenceBPMs.push(seqSettings.bpm || 0);
            updateBPM(seqSettings.bpm);
            const convertedSettings = convertSequenceSettings(seqSettings);
            console.log("Converted Settings:", convertedSettings);
            return convertSequenceSettings(seqSettings);
        } else {
            console.error("One of the sequences in the imported array doesn't match the expected format.");
            return null;
        }
    }).filter(Boolean);

    console.log("Sequences after processing:", sequences);
    console.log("Extracted sequence names:", sequenceNames);
    console.log("Updated sequenceBPMs:", sequenceBPMs);

    currentSequence = sequences.length;
    channelSettings = sequences[currentSequence - 1];
    updateUIForSequence(currentSequence);
}
