// --- GLOBAL VARIABLES ---
let curVib = 0;
let tappedTwice = false, zoomed = false;
let invert = true, hide = true, desaturate = true;
let origMatrix = [], initialValue = [];
let msg;

// --- VIBRATION ---
function vibrate(duration = 500) {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
    curVib = duration;
  }
}

// --- SPEECH SYNTHESIS SETUP ---
function loadVoicesAndAssign() {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0 && msg) {
    msg.voice = voices.find(v => v.lang === 'en-US') || voices[0];
  }
}

if ('speechSynthesis' in window) {
  msg = new SpeechSynthesisUtterance();
  msg.lang = 'en-US';
  window.speechSynthesis.onvoiceschanged = loadVoicesAndAssign;
  loadVoicesAndAssign();
}

function speakText(text) {
  if (msg && 'speechSynthesis' in window) {
    msg.text = text;
    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(msg);
  }
}

// --- INITIALISE INTERACTIVITY ---
function init() {
  const $svgGroup = $("#svgGroup");
  if ($svgGroup.length > 0) {
    const transform = $svgGroup.attr("transform");
    if (transform) {
      const matrixString = transform.replace(/[^0-9.,-]+/g, "");
      const matrixArray = matrixString.split(",").map(parseFloat);
      origMatrix = [...matrixArray];
      initialValue = [...matrixArray];
    }
  }

  $(".zoomed").hide();

  // Handle all SVG paths for audio/haptic feedback
  document.querySelectorAll('path').forEach(svgPath => {
    svgPath.addEventListener('mouseover', e => startSpeechAndVib(e.target));
    svgPath.addEventListener('mouseleave', stopSpeechAndVib);
  });

  // Optional: handle rects for hover effects
  document.querySelectorAll('rect').forEach(svgRect => {
    svgRect.addEventListener('mouseover', borderReact);
  });

  // Menu hover
  $('#uiDiv').on("mouseenter", () => {
    speakText("Menu");
  });

  // --- UI BUTTONS ---

  // Hide/show image
  $("#hide").click(() => {
    vibrate();
    hide = !hide;
    $("image").toggle(hide);
    $("#hide").text(hide ? "Hide Artwork" : "Show Artwork");
    speakText(hide ? "Artwork now displayed" : "Artwork now hidden");
  });

  // Invert SVG colors
  $("#invert").click(() => {
    vibrate();
    invert = !invert;
    $("svg").css("backgroundColor", invert ? "white" : "black");
    $("path").css("stroke", invert ? "black" : "white");
    speakText("Outline colours inverted");
  });

  // Toggle grayscale filter
  $("#grey").click(() => {
    vibrate();
    desaturate = !desaturate;
    $("#filter").toggleClass("filtered", desaturate);
    $("#grey").text(desaturate ? "Remove Colours" : "Add Colours");
    speakText(desaturate ? "Colours removed" : "Colours added");
  });
}

// --- SPEECH + VIBRATION ON HOVER ---
function startSpeechAndVib(target) {
  const desc = target.querySelector("desc");
  if (desc && desc.textContent) {
    speakText(desc.textContent);
  }
  vibrate();
}

function stopSpeechAndVib() {
  window.speechSynthesis.cancel();
}

// --- OPTIONAL: VISUAL REACTION ON BORDER ---
function borderReact() {
  vibrate(200);
}
