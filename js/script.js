// Cache DOM elements once
const elements = {
  openSetButton: document.getElementById("settings"),
  closeSetButton: document.getElementById("close"),
  settings: document.getElementById("settingsArea"),
  valueFDisplay: document.getElementById("focusValueDisplay"),
  valueBDisplay: document.getElementById("breakValueDisplay"),
  timer: document.getElementById("timer"),
  startButton: document.getElementById("start"),
  pauseButton: document.getElementById("pause"),
  progressBar: document.getElementById("progressBar"),
  mode: document.getElementById("mode"),
  modeIcon: document.getElementById("modeIcon"),
  loader: document.getElementById("loaderContainer"),
};

// Constants
const CONFIG = {
  minFValue: 5,
  maxFValue: 60,
  minBValue: 5,
  maxBValue: 30,
  step: 5,
};

const MODES = {
  FOCUS: "FOCUS",
  BREAK: "BREAK",
};

const ICONS = {
  FOCUS: "fa-solid fa-eye",
  BREAK: "fa-solid fa-mug-hot",
};

// State object to group related variables
const state = {
  currentFValue: 25,
  currentBValue: 5,
  timeFLeft: 25 * 60,
  totalFTime: 25 * 60,
  timeBLeft: 5 * 60,
  totalBTime: 5 * 60,
  interval: null,
};

function openSettings() {
  elements.settings.style.display = "flex";
  elements.openSetButton.style.display = "none";
  elements.closeSetButton.style.display = "flex";
}

function closeSettings() {
  elements.settings.style.display = "none";
  elements.openSetButton.style.display = "flex";
  elements.closeSetButton.style.display = "none";
}

// Helper function to update timer values
function updateTimerValues(isFocus, newValue) {
  if (isFocus) {
    state.timeFLeft = newValue * 60;
    state.totalFTime = newValue * 60;
    elements.valueFDisplay.textContent = newValue;
  } else {
    state.timeBLeft = newValue * 60;
    state.totalBTime = newValue * 60;
    elements.valueBDisplay.textContent = newValue;
  }

  const currentMode = elements.mode.textContent;
  const isCurrentMode =
    (isFocus && currentMode === MODES.FOCUS) ||
    (!isFocus && currentMode === MODES.BREAK);

  if (isCurrentMode) {
    const timeToShow = isFocus ? state.timeFLeft : state.timeBLeft;
    const totalFTimeToShow = isFocus ? state.totalFTime : state.totalBTime;
    updateTimer(timeToShow);
    updateProgressBar(timeToShow, totalFTimeToShow);
  }
}

function focusInValue() {
  if (state.currentFValue < CONFIG.maxFValue) {
    pauseTimer();
    state.currentFValue += CONFIG.step;
    updateTimerValues(true, state.currentFValue);
  }
}

function focusDeValue() {
  if (state.currentFValue > CONFIG.minFValue) {
    pauseTimer();
    state.currentFValue -= CONFIG.step;
    updateTimerValues(true, state.currentFValue);
  }
}

function breakInValue() {
  if (state.currentBValue < CONFIG.maxBValue) {
    pauseTimer();
    state.currentBValue += CONFIG.step;
    updateTimerValues(false, state.currentBValue);
  }
}

function breakDeValue() {
  if (state.currentBValue > CONFIG.minBValue) {
    pauseTimer();
    state.currentBValue -= CONFIG.step;
    updateTimerValues(false, state.currentBValue);
  }
}

function updateTimer(timeFLeftType) {
  const minutes = Math.floor(timeFLeftType / 60);
  const seconds = timeFLeftType % 60;
  elements.timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateProgressBar(timeFLeftType, totalFTimeType) {
  const progressPercentage =
    ((totalFTimeType - timeFLeftType) / totalFTimeType) * 100;
  elements.progressBar.style.width = progressPercentage + "%";
}

// Helper function to handle timer completion
function handleTimerComplete() {
  pauseTimer();
  switchTimerMode();

  if (elements.mode.textContent === MODES.BREAK) {
    state.timeBLeft = state.currentBValue * 60;
    state.totalBTime = state.currentBValue * 60;
    updateTimer(state.timeBLeft);
    updateProgressBar(state.timeBLeft, state.totalBTime);
    startTimer();
  } else {
    state.timeFLeft = state.currentFValue * 60;
    state.totalFTime = state.currentFValue * 60;
    updateTimer(state.timeFLeft);
    updateProgressBar(state.timeFLeft, state.totalFTime);
  }
}

function startTimer() {
  elements.pauseButton.style.display = "flex";
  elements.startButton.style.display = "none";

  const isFocusMode = elements.mode.textContent === MODES.FOCUS;

  state.interval = setInterval(() => {
    if (isFocusMode) {
      state.timeFLeft--;
      updateTimer(state.timeFLeft);
      updateProgressBar(state.timeFLeft, state.totalFTime);
      if (state.timeFLeft === 0) {
        handleTimerComplete();
      }
    } else {
      state.timeBLeft--;
      updateTimer(state.timeBLeft);
      updateProgressBar(state.timeBLeft, state.totalBTime);
      if (state.timeBLeft === 0) {
        handleTimerComplete();
      }
    }
  }, 1000);
}

function pauseTimer() {
  elements.pauseButton.style.display = "none";
  elements.startButton.style.display = "flex";
  clearInterval(state.interval);
}

function resetTimer() {
  pauseTimer();
  elements.mode.textContent = MODES.FOCUS;
  elements.modeIcon.className = ICONS.FOCUS;

  // Reset to initial values
  state.currentFValue = 25;
  state.currentBValue = 5;
  state.timeFLeft = state.currentFValue * 60;
  state.totalFTime = state.currentFValue * 60;
  state.timeBLeft = state.currentBValue * 60;
  state.totalBTime = state.currentBValue * 60;

  elements.valueFDisplay.textContent = state.currentFValue;
  elements.valueBDisplay.textContent = state.currentBValue;
  updateTimer(state.timeFLeft);
  updateProgressBar(state.timeFLeft, state.totalFTime);
}

function switchTimerMode() {
  const isFocusMode = elements.mode.textContent === MODES.FOCUS;
  elements.mode.textContent = isFocusMode ? MODES.BREAK : MODES.FOCUS;
  elements.modeIcon.className = isFocusMode ? ICONS.BREAK : ICONS.FOCUS;
}

// Hide loader when page is fully loaded
window.addEventListener("load", () => {
  elements.loader.style.display = "none";
});
