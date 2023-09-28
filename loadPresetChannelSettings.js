function loadChannelSettingsFromPreset(preset) {
    console.log("Before loading preset:", JSON.stringify(channelSettings));
  
    preset.channels.forEach((channelData, channelIndex) => {
        channelData.triggers.forEach(trigger => {
            channelSettings[channelIndex].steps[trigger] = true;
        });
        
        if (channelData.url) {
            channelSettings[channelIndex].url = channelData.url;
            const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"] .load-sample-button`);
            fetchAudio(channelData.url, channelIndex, loadSampleButton);
        }
        console.log("After loading preset:", JSON.stringify(channelSettings));
  
    });
  
    console.log(`Loaded channel settings from preset for Sequence ${currentSequence}`);
  }
  
  loadChannelSettingsFromPreset();