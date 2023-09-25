// importExport.js

const EMPTY_CHANNEL = {
    "triggers": [],
    "mute": false,
    "toggleMuteSteps": [],
    "url": ""
};

function exportSettings() {
    let allSequencesSettings = [];

    sequences.forEach((sequence, seqIndex) => {
        let settings = { channels: [], bpm: bpm };

        for (let i = 0; i < 16; i++) { // Ensure we always iterate over 16 channels
            let channelSteps = sequence[i] || [];
            let url = channels[i] && channels[i].dataset ? channels[i].dataset.originalUrl : "";

            let triggers = [];
            channelSteps.forEach((stepState, stepIndex) => {
                if (stepState && stepIndex !== 0) {
                    triggers.push(stepIndex);
                }
            });

            let mute = channels[i] && channels[i].dataset ? channels[i].dataset.muted === 'true' : false;
            if (url) {
                settings.channels.push({ triggers: triggers, mute: mute, toggleMuteSteps: [], url: url });
            } else {
                settings.channels.push(EMPTY_CHANNEL);
            }
        }

        allSequencesSettings.push(settings);
    });

    let filename = `audiSeq_BPM${bpm}_AllSequences.json`;
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename: filename };
}

function importSettings(json) {
    let importedData = JSON.parse(json);

    if (!Array.isArray(importedData)) {
        if (importedData.channels) {
            importedData = [importedData];
        } else {
            console.error("Imported JSON doesn't match expected format.");
            return;
        }
    }

    sequences = [];

    importedData.forEach((settings) => {
        let channels = settings.channels;
        if (channels.length < 16) {
            let emptyChannelsToAdd = 16 - channels.length;
            for (let i = 0; i < emptyChannelsToAdd; i++) {
                channels.push(EMPTY_CHANNEL);
            }
        }

        let sequenceChannelSettings = channels.map(ch => convertChannelToStepSettings(ch));
        sequences.push(sequenceChannelSettings);
    });

    currentSequence = 1;
    channelSettings = sequences[currentSequence - 1];
    updateUIForSequence(currentSequence);
}

function convertChannelToStepSettings(channel) {
    let stepSettings = [null].concat(Array(64).fill(false)); // Placeholder for 0th index

    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });

    return stepSettings;
}
