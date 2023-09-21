function setChannelVolume(channelIndex, volume) {
    const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    channel.dataset.volume = volume;
    updateChannelVolume(channel);
    }

  function updateChannelVolume(channel) {
    const volume = parseFloat(channel.dataset.volume);
    const gainNode = gainNodes[parseInt(channel.dataset.id.split('-')[1]) - 1];
    gainNode.gain.value = volume;
    }

  function createGainNodes() {
    const audioContext = new AudioContext();
    channels.forEach(channel => {
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1; // Initial volume set to 1 (full volume)
        gainNode.connect(audioContext.destination);
        gainNodes.push(gainNode);
    });
    }
