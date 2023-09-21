// stepHandling.js

function handleStep(channel, channelData, totalStepCount) {
    let isMuted = channel.dataset.muted === 'true';
    const isToggleMuteStep = channelData.toggleMuteSteps.includes(totalStepCount);

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

    // Only iterate over active channels
    activeChannels.forEach((channelIndex) => {
        const channel = channels[channelIndex];
        const buttons = channel.querySelectorAll('.step-button');
        let channelData = presetData.channels[channelIndex];

        // If no channelData is found for the current channel, use a default set of values
        if (!channelData) {
            console.warn(`Using default values for channel index: ${channelIndex}`);
            channelData = {
                triggers: [],
                toggleMuteSteps: [],
                mute: false,
                url: null
            };
        }

        renderPlayhead(buttons, currentStep, channel.dataset.muted === 'true');
        const isMuted = handleStep(channel, channelData, totalStepCount);
        playSound(channel, currentStep, isMuted);
    });

    currentStep = (currentStep + 1) % 64;
    totalStepCount = (totalStepCount + 1);

    if (currentStep % 4 === 0) {
        beatCount++;  
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

