// uiInteractions.js

document.getElementById('next-sequence').addEventListener('click', loadNextSequence);

function setupMuteButtonForChannel(channel, index) {
    const muteButton = channel.querySelector('.mute-button');
    muteButton.addEventListener('click', () => {
        const isSoloed = soloedChannels[index];
        
        // If the channel is currently soloed, unsolo it before muting
        if (isSoloed) {
            soloedChannels[index] = false;
            soloButton.classList.remove('selected');
        }

        // Update mute state after addressing solo state
        const currentMuteState = channel.dataset.muted === 'true';
        updateMuteState(channel, !currentMuteState);
        console.log(`Channel-${index + 1} channels.forEach just toggled updateMuteState`);
    });
}

function createStepButtonsForChannel(channel, channelIndex) {
    const stepsContainer = channel.querySelector('.steps-container');
    stepsContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 64; i++) {
        const button = document.createElement('button');
        button.classList.add('step-button');
        
        button.addEventListener('click', () => {
            button.classList.toggle('selected');

            // Update the step's state in the channelSettings
            let stepState = button.classList.contains('selected');
            updateStep(channelIndex, i, stepState);
        });

        fragment.appendChild(button);
    }

    stepsContainer.appendChild(fragment);
}
