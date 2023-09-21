// stepHandling.js



function handleStep(channel, channelData, totalStepCount) {
    let isMuted = channel.dataset.muted === 'true';
    const isToggleMuteStep = channelData.toggleMuteSteps.includes(totalStepCount);

    // Update toggleMuteState only if conditions are met
    if (isToggleMuteStep) {
      isMuted = !isMuted;
      channel.dataset.muted = isMuted ? 'true' : 'false';
      // Update the mute state in the DOM
      updateMuteState(channel, isMuted);
      console.log('Mute toggled by the handleStep function');
    }

    return isMuted;
  }

function renderPlayhead(buttons, currentStep, isMuted) {
    buttons.forEach((button, buttonIndex) => {
    button.classList.remove('playing');
    button.classList.remove('triggered');

    if (buttonIndex === currentStep && !isMuted) {
      button.classList.add('playing');
    }

    if (button.classList.contains('selected')) {
      button.classList.add('triggered');
    }
  });
}

function playStep() {
    const presetData = presets.preset1;
  
    channels.forEach((channel, index) => {
      const buttons = channel.querySelectorAll('.step-button');
      const channelData = presetData.channels[index];
  
      if (!channelData) {
        console.error('Channel data not found for index:', index);
        return;
      }
  
      renderPlayhead(buttons, currentStep, channel.dataset.muted === 'true');
      const isMuted = handleStep(channel, channelData, totalStepCount);
      playSound(channel, currentStep, isMuted);
    });
  
      // Log the beat, bar, and sequence counts
      //console.log('Step:', currentStep);
      //console.log('Beat:', beatCount);
      //console.log('Bar:', barCount);  // Use barCount instead of currentBar
      //console.log('Sequence:', sequenceCount);
  
      currentStep = (currentStep + 1) % 64;
      totalStepCount = (totalStepCount + 1);
  
      if (currentStep % 4 === 0) {
          beatCount++;  // No wrap-around here
      }
  
      if (currentStep % 16 === 0) {
          barCount = (barCount + 1);
      }
  
      if (currentStep % 64 === 0) {
          sequenceCount++;
      }
  
      nextStepTime += stepDuration;
  
      displayUpdatedValues();
  
  }