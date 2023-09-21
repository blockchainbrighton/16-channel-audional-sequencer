// importExport.js

function exportSettings() {
    let settings = { channels: [], bpm: bpm };

    channels.forEach((channel, index) => {
        let url = channel.dataset.originalUrl; // Use the original URL

        // Only save the channel if it has a loaded sample
        if (url) {
            let triggers = [];
            let toggleMuteSteps = [];
            let stepButtons = channel.querySelectorAll('.step-button');

            stepButtons.forEach((button, i) => {
                if (button.classList.contains('selected')) {
                    triggers.push(i + 1); // nth-child selector is 1-based
                }
                if (button.classList.contains('toggle-mute')) {
                    toggleMuteSteps.push(i + 1);
                }
            });

            let mute = channel.dataset.muted === 'true';
            settings.channels.push({ triggers: triggers, mute: mute, toggleMuteSteps: toggleMuteSteps, url: url });
        }
    });

    let filename = `audiSeq_BPM${bpm}.json`;
    return { settings: JSON.stringify(settings, null, 2), filename: filename };
}

function importSettings(json) {
    let settings = JSON.parse(json);
    bpm = settings.bpm;

    // Update BPM related elements
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
    bpmSlider.dispatchEvent(new Event('input'));

    if (settings.currentSequence !== undefined) {
        currentSequence = settings.currentSequence;
    }

    channels.forEach((channel, index) => {
        const chSettings = settings.channels[index];

        if (!chSettings) {
            console.warn(`No settings data for channel index: ${index}`);
            return;
        }

        let loadSampleButton = channel.querySelector('.load-sample-button');
        if (chSettings.url) {
            fetchAudio(chSettings.url, index, loadSampleButton);
        }

        // Set mute settings
        updateMuteState(channel, chSettings.mute);

        // Set trigger buttons
        let stepButtons = channel.querySelectorAll('.step-button');
        stepButtons.forEach(button => button.classList.remove('selected', 'toggle-mute'));

        chSettings.triggers.forEach(i => stepButtons[i - 1].classList.add('selected'));

        if (chSettings.toggleMuteSteps) {
            chSettings.toggleMuteSteps.forEach(i => {
                const shouldMute = !stepButtons[i - 1].classList.contains('toggle-mute');
              stepButtons[i - 1].classList.toggle('toggle-mute'); // toggle mute
              updateMuteState(channel, shouldMute);
              console.log('Mute has been toggled in importSettings 2nd call');
      
            });
          }
        });
      }
      