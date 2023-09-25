// importExport.js

const EMPTY_CHANNEL = {
    "triggers": [],
    "mute": false,
    "toggleMuteSteps": [],
    "url": ""
};



function exportSettings() {
    let allSequencesSettings = [];

    for (let seqIndex = 0; seqIndex < sequences.length; seqIndex++) {
        const sequence = sequences[seqIndex];
        let hasTriggers = false;  // Assume sequence has no triggers until proven otherwise
        let settings = {
            channels: [],
            bpm: sequenceBPMs[seqIndex],
            name: `Sequence_${seqIndex + 1}`
        };

        for (let i = 0; i < 16; i++) {
            let channelSteps = sequence[i] || [];
            let url = channels[i] && channels[i].dataset ? channels[i].dataset.originalUrl : "";

            let triggers = [];
            channelSteps.forEach((stepState, stepIndex) => {
                if (stepState && stepIndex !== 0) {
                    triggers.push(stepIndex);
                }
            });

            let mute = channels[i] && channels[i].dataset ? channels[i].dataset.muted === 'true' : false;
            if (triggers.length > 0) {
                hasTriggers = true;  // The sequence has triggers if at least one channel has triggers
            }
            settings.channels.push({
                triggers: triggers,
                mute: mute,
                toggleMuteSteps: [],
                url: url
            });
        }

        if (!hasTriggers) {
            break;  // Stop the export process if the current sequence doesn't have any triggers
        }

        allSequencesSettings.push(settings);
    }

    let filename = `audiSeq_AllSequences.json`;
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename: filename };
}



function importSettings(settings) {
    let parsedSettings;

    try {
        parsedSettings = JSON.parse(settings);
    } catch (error) {
        console.error("Error parsing settings:", error);
        return;
    }

    if (parsedSettings.urls && Array.isArray(parsedSettings.urls)) {
        // Assuming collectedURLs is an array, you can concatenate it with new URLs
        collectedURLs = collectedURLs.concat(parsedSettings.urls);
    }

    // Utility function to check if the structure is valid
    function isValidSequence(seq) {
        return seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
    }

    if (!Array.isArray(parsedSettings) && sequences.length > 0) {
        if (isValidSequence(parsedSettings)) {
            sequences.push(convertSequenceSettings(parsedSettings)); // Add the new sequence to the existing sequences
        } else {
            console.error("Imported JSON doesn't match expected format.");
            return;
        }
    } else {
        // Ensure that if it's a single sequence, it's converted into an array format
        if (!Array.isArray(parsedSettings)) {
            if (isValidSequence(parsedSettings)) {
                parsedSettings = [parsedSettings];
            } else {
                console.error("Imported JSON doesn't match expected format.");
                return;
            }
        }

        // If it's an array of sequences, check if the BPM is provided in the first sequence
        if (parsedSettings[0] && parsedSettings[0].bpm) {
            bpm = parsedSettings[0].bpm;
            
            // Get the bpm slider and display elements
            let bpmSlider = document.getElementById('bpm-slider');
            let bpmDisplay = document.getElementById('bpm-display');
            
            // Update the bpm slider and display
            bpmSlider.value = bpm;
            bpmDisplay.innerText = bpm;  // update the bpm text label
        
            // Manually trigger the input event to update the sequencer's bpm
            bpmSlider.dispatchEvent(new Event('input'));

            currentBPM = parsedSettings[0].bpm;
        }

        sequences = parsedSettings.map(seqSettings => {
            if (isValidSequence(seqSettings)) {
                return convertSequenceSettings(seqSettings);
            } else {
                console.error("One of the sequences in the imported array doesn't match the expected format.");
                return null;
            }
        }).filter(Boolean); // Filter out any invalid sequences
    }

    currentSequence = sequences.length; // Set the last sequence as the current sequence
    channelSettings = sequences[currentSequence - 1];
    updateUIForSequence(currentSequence);
}




function convertSequenceSettings(settings) {
    let channels = settings.channels;
    if (channels.length < 16) {
        let emptyChannelsToAdd = 16 - channels.length;
        for (let i = 0; i < emptyChannelsToAdd; i++) {
            channels.push(EMPTY_CHANNEL);
        }
    }

    return channels.map(ch => convertChannelToStepSettings(ch));
}


function convertChannelToStepSettings(channel) {
    let stepSettings = [channel.url].concat(Array(64).fill(false)); // Store the URL at the 0th index

    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });

    return stepSettings;
}

