// importExport.js

function exportSettings() {
    let settings = { channels: [], bpm: bpm };
    channels.forEach((channel, index) => {
        let triggers = [];
        let toggleMuteSteps = [];
        let stepButtons = channel.querySelectorAll('.step-button');
        stepButtons.forEach((button, i) => {
            if (button.classList.contains('selected')) {
                triggers.push(i + 1); // we use (i+1) because nth-child selector is 1-based
            }
            if (button.classList.contains('toggle-mute')) {
                toggleMuteSteps.push(i + 1);
            }
        });

        let mute = channel.dataset.muted === 'true';
        let url = channel.dataset.originalUrl; // Use the original URL
        settings.channels.push({ triggers: triggers, mute: mute, toggleMuteSteps: toggleMuteSteps, url: url });
    });

        let filename = `audiSeq_BPM${bpm}.json`;
        return { settings: JSON.stringify(settings, null, 2), filename: filename };
    }


    function importSettings(json) {
        let settings = JSON.parse(json);
        bpm = settings.bpm;
      
        // Get the bpm slider and display elements
        let bpmSlider = document.getElementById('bpm-slider');
        let bpmDisplay = document.getElementById('bpm-display');
      
        // Update the bpm slider and display
        bpmSlider.value = bpm;
        bpmDisplay.innerText = bpm;  // update the bpm text label
      
        // Manually trigger the input event to update the sequencer's bpm
        bpmSlider.dispatchEvent(new Event('input'));
      
        if (settings.currentSequence !== undefined) {
          currentSequence = settings.currentSequence; // Set current sequence from imported data
        }
      
        settings.channels.forEach((chSettings, index) => {
          let channel = document.querySelector(`.channel[data-id="Channel-${index + 1}"]`);
          let loadSampleButton = channel.querySelector('.load-sample-button');
      
          // Fetch and set audio sample URL only if url is defined
          if(chSettings.url) {
            fetchAudio(chSettings.url, index, loadSampleButton);
          }
      
          // Set mute settings
          updateMuteState(channel, chSettings.mute);
          console.log('Mute has been toggled in importSettings 1st call');
      
      
          // Set trigger buttons
          let stepButtons = channel.querySelectorAll('.step-button');
          stepButtons.forEach(button => {
            button.classList.remove('selected', 'toggle-mute'); // clear existing triggers and mute toggles
          });
          chSettings.triggers.forEach(i => stepButtons[i - 1].classList.add('selected')); // set new triggers
      
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
      