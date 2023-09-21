// stepSchedulers.js

function startScheduler() {
    audioContext = new AudioContext();
    startTime = audioContext.currentTime;
    nextStepTime = startTime;

    scheduleNextStep();
}

function pauseScheduler() {
    clearTimeout(timeoutId); // Clear the current timeout without closing the audio context
    pauseTime = audioContext.currentTime;  // record the time at which the sequencer was paused
    isPaused = true;
}

function resumeScheduler() {
  if(isPaused) {
      // Replace the startTime adjustment with a nextStepTime reset
      nextStepTime = audioContext.currentTime;
      isPaused = false;
  }
  scheduleNextStep(); // Begin scheduling steps again
}


function scheduleNextStep() {
    stepDuration = 60 / bpm / 4;

    timeoutId = setTimeout(() => {
        playStep();
        scheduleNextStep();
    }, (nextStepTime - audioContext.currentTime) * 1000);
}

function stopScheduler() {
    if (audioContext) {
        audioContext.close();
    }
    clearTimeout(timeoutId);

    // Reset counters
    currentStep = 0;
    beatCount = 1;
    barCount = 1; // Reset barCount to 1
    sequenceCount = 0;
    isPaused = false;
    pauseTime = 0;
}

function resetStepLights() {
  const buttons = document.querySelectorAll('.step-button');
  buttons.forEach(button => {
      button.classList.remove('playing');
  });
  }
