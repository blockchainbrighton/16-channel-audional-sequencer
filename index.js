
    let isPlaying = false;
    let currentStep = 0;
    let totalStepCount = 0
    let beatCount = 1; // individual steps
    let barCount = 1; // bars
    let sequenceCount = 1; // sequences
    let timeoutId;
    let isPaused = false; // a flag to indicate if the sequencer is paused
    let pauseTime = 0;  // tracks the total paused time
    let stopClickCount = 0;
    let playButton = document.getElementById('play');
    let stopButton = document.getElementById('stop');
    let saveButton = document.getElementById('save-button');
    let loadButton = document.getElementById('load-button');
    let bpm = 105;
    let audioContext;
    let currentStepTime;
    let startTime;
    let nextStepTime;
    let stepDuration;
    let gainNodes = [];
    let isMuted = false;
    let channelMutes = []; // Declare the channelMutes array as a global variable
    let muteState = false
    const sequenceLength = 64;
    const audioBuffers = new Map();
    let channels = document.querySelectorAll('.channel');

channels.forEach((channel, index) => {
  channel.dataset.id = `Channel-${index + 1}`;

  const muteButton = channel.querySelector('.mute-button');
  muteButton.addEventListener('click', () => {
    const currentMuteState = channel.dataset.muted === 'true';
    updateMuteState(channel, !currentMuteState);
    console.log(`Channel-${index + 1} channels.forEach just toggled updateMuteState`);
  });

  const clearButton = channel.querySelector('.clear-button');
  clearButton.addEventListener('click', () => {
    const stepButtons = channel.querySelectorAll('.step-button');
    stepButtons.forEach(button => {
      button.classList.remove('selected');
    });
  });

  const stepsContainer = channel.querySelector('.steps-container');
  stepsContainer.innerHTML = '';

  // Check if the current channel is 'channel-1'
  let isChannelOne = channel.id === 'channel-1';

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 64; i++) {
    const button = document.createElement('button');
    button.classList.add('step-button');
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
    });

    fragment.appendChild(button);
  }

  stepsContainer.appendChild(fragment);

            const loadSampleButton = channel.querySelector('.load-sample-button');
                loadSampleButton.addEventListener('click', () => {
                    // Create a basic modal for audional ID input
                    const idModal = document.createElement('div');
                    idModal.style.position = 'fixed';
                    idModal.style.left = '0';
                    idModal.style.top = '0';
                    idModal.style.width = '100%';
                    idModal.style.height = '100%';
                    idModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    idModal.style.display = 'flex';
                    idModal.style.justifyContent = 'center';
                    idModal.style.alignItems = 'center';
                    idModal.style.zIndex = '9999';

                    const idModalContent = document.createElement('div');
                    idModalContent.style.backgroundColor = 'white';
                    idModalContent.style.padding = '20px';
                    idModalContent.style.borderRadius = '10px';
                    idModalContent.style.maxHeight = '500px';  // Adjust this value as per your needs
                    idModalContent.style.overflowY = 'auto';

                    const instructionText = document.createElement('p');
                    instructionText.textContent = 'Enter the ordinal ID for the Audional you want to load:';
                    idModalContent.appendChild(instructionText);

                    // Add input field
                    const audionalInput = document.createElement('input');
                    audionalInput.type = 'text';
                    audionalInput.placeholder = 'Enter ID or choose below:';
                    audionalInput.style.marginBottom = '10px';
                    idModalContent.appendChild(audionalInput);

                    const loadButton = document.createElement('button');
                    loadButton.textContent = 'Load';
                    loadButton.addEventListener('click', () => {
                        const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalInput.value);
                        fetchAudio(audionalUrl, index, loadSampleButton);
                        document.body.removeChild(idModal);
                    });
                    idModalContent.appendChild(loadButton);

                    audionalIDs.forEach((audionalObj) => {
                        const idLink = document.createElement('a');
                        idLink.href = '#';
                        idLink.textContent = audionalObj.label;
                        idLink.style.display = 'block';
                        idLink.style.marginBottom = '10px';
                        idLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalObj.id);
                            fetchAudio(audionalUrl, index, loadSampleButton);
                            document.body.removeChild(idModal);
                        });
                        idModalContent.appendChild(idLink);
                    });

                    idModal.appendChild(idModalContent);
                    document.body.appendChild(idModal);
                });

        });

        if (playButton && stopButton) {
          const channel1 = document.querySelector('#channel-0 .step-button:nth-child(4n+1)');
          if (channel1) channel1.classList.add('selected');

          const channel2Beat1 = document.querySelector('#channel-1 .step-button:nth-child(1)');
          if (channel2Beat1) channel2Beat1.classList.add('selected');

          const channel2Beat6 = document.querySelector('#channel-1 .step-button:nth-child(6)');
          if (channel2Beat6) channel2Beat6.classList.add('selected');

          let isPaused = false;  // Add this line to declare the isPaused flag

          playButton.addEventListener('click', () => {
            if (!isPlaying) {
              startScheduler();
              playButton.classList.add('selected');
              stopButton.classList.remove('selected');
              isPlaying = true;
              isPaused = false;  // Ensure that the isPaused flag is set to false when starting playback
            } else if (!isPaused) {  // If the sequencer is playing and is not paused, pause the sequencer
              pauseScheduler();
              isPaused = true;
            } else {  // If the sequencer is paused, resume the sequencer
              resumeScheduler();
              isPaused = false;
            }
          });

          stopButton.addEventListener('click', () => {
              if (isPlaying) {
                  stopScheduler();
                  stopButton.classList.add('selected');
                  playButton.classList.remove('selected');
                  isPlaying = false;
                  isPaused = false;  // Reset the isPaused flag when stopping the sequencer
                  beatCount = 0;  // reset the beat count
                  barCount = 0; // reset the bar count
                  sequenceCount = 0; // reset the sequence count
                  currentStep = 0;  // reset the step count
                  totalStepCount = 0;
                  resetStepLights();  // reset the step lights
              }
          });

        } else {
          console.error("Play or Stop button is not defined");
        }



// The loadPreset function is updated to use updateMuteState function
  const loadPreset = (preset) => {
  const presetData = presets[preset];

  if (!presetData) {
    console.error('Preset not found:', preset);
    return;
  }

  presetData.channels.forEach((channelData, index) => {
    const { url, triggers, toggleMuteSteps, mute } = channelData;

    if (url) { // Only fetch audio if a URL is provided
      const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .load-sample-button`);
      fetchAudio(url, index, loadSampleButton);
    }

    triggers.forEach(pos => {
      const btn = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .step-button:nth-child(${pos})`);
      if (btn) btn.classList.add('selected');
    });

    toggleMuteSteps.forEach(pos => {
      const btn = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .step-button:nth-child(${pos})`);
      if (btn) btn.classList.add('toggle-mute');
      console.log(`Channel-${index + 1} loadPreset classList.add`);
    });

    const channelElement = document.querySelector(`.channel[data-id="Channel-${index + 1}"]`);
    const muteButton = channelElement.querySelector('.mute-button');
    if (muteButton) {
      updateMuteState(channelElement, mute); // Correctly pass the 'mute' argument to updateMuteState function
      console.log(`Channel-${index + 1} updateMuteState toggled by the loadPreset function - Muted: ${mute}`);
    }
  });
};

// Load a preset when the page loads
const presetToLoadOnPageLoad = 'preset1';
if (presets[presetToLoadOnPageLoad]) {
  loadPreset(presetToLoadOnPageLoad);
} else {
  console.error('Preset not found:', presetToLoadOnPageLoad);
}


  
    


