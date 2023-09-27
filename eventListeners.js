


document.addEventListener("DOMContentLoaded", function() {
  let saveButton = document.getElementById('save-button'); // Add this line
  let saveFileInput = document.getElementById('save-file-input');
  let loadFileInput = document.getElementById('load-file-input');

  saveButton.addEventListener('click', () => {
    let { settings, filename } = exportSettings();

    // Create a Blob with the settings
    let blob = new Blob([settings], { type: 'application/json' });

    // Create a download link for the Blob
    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;

    // Trigger a click on the download link
    downloadLink.click();
  });
  
    
  
  
    loadButton.addEventListener('click', () => {
      console.log("Load sequence button clicked");
      loadFileInput.click();
  });
  
  loadFileInput.addEventListener('change', () => {
      let file = loadFileInput.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
          let settings = e.target.result;
          importSettings(settings);
      };
      reader.readAsText(file);
  });
});

  // Listen for messages
  window.addEventListener('message', function(event) {
    // If a 'load' command is received, load the song
    if (event.data.command === 'load') {
        fetch(event.data.path)
            .then(response => response.json())
            .then(song => loadSong(song));
    }
    // If a 'play' command is received, start the sequencer
    else if (event.data.command === 'play') {
        startScheduler();
    }
    // If a 'stop' command is received, stop the sequencer
    else if (event.data.command === 'stop') {
        stopScheduler();
    }
    // If a 'pause' command is received, pause the sequencer
    else if (event.data.command === 'pause') {
        pauseScheduler();
    }
});

function updateUIForSequence(sequenceNumber) {
    if (sequenceNumber > 0 && sequenceNumber <= sequences.length) {
        channelSettings = sequences[sequenceNumber - 1];
    } else {
        console.error("Invalid sequence number:", sequenceNumber);
        return; // Exit the function if the sequence number is invalid
    }
    const sequenceSettings = sequences[sequenceNumber - 1];
    if (!sequenceSettings) {
        console.error("No settings found for sequence number:", sequenceNumber);
        return; // Exit the function if there are no settings for the sequence
    }
    channels.forEach((channel, index) => {
        if (!sequenceSettings[index]) {
            console.error("No settings found for channel index:", index, "in sequence number:", sequenceNumber);
            return; // Skip this iteration if there are no settings for the channel
        }
        const stepButtons = channel.querySelectorAll('.step-button');
        const toggleMuteButtons = channel.querySelectorAll('.toggle-mute');


        // Clear all step buttons and toggle mute states
        stepButtons.forEach(button => button.classList.remove('selected'));
        toggleMuteButtons.forEach(button => button.classList.remove('toggle-mute'));

        // Update the steps based on the sequence settings
        sequenceSettings[index].steps.forEach((stepState, pos) => { // <-- This line was changed
            // Skip the 0th position (our placeholder)
            if (pos === 0) return;

            if (stepState) {
                stepButtons[pos - 1].classList.add('selected');
            }
        });

        // You can add similar logic for updating other UI elements like toggle mute states, volume, etc.
    });
}






document.getElementById('prev-sequence').addEventListener('click', function() {
  if (currentSequence > 1) {
      // Save current sequence's settings
      saveCurrentSequence(currentSequence);

      // Decrement the current sequence number and load its settings
      currentSequence--;
      loadSequence(currentSequence);
      
      // Update the display and highlight the active button
      document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
      updateActiveQuickPlayButton();
  } else {
      console.warn("You're already on the first sequence.");
  }
});


