// --- GLOBALS ---
let curVib = 0;
let tappedTwice = false, zoomed = false;
let invert = true, hide = true, desaturate = true;
let snd, newMatrix;
let origMatrix, initialValue;
let msg, voices;

// --- VIBRATION ---
function vibrate(duration = 500) {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(duration);
        curVib = duration;
    }
}

// --- SPEECH SYNTHESIS SETUP ---
function loadVoicesAndAssign() {
    voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0 && msg) {
        msg.voice = voices.find(v => v.lang === 'en-US') || voices[0];
    }
}
if ('speechSynthesis' in window) {
    msg = new SpeechSynthesisUtterance();
    msg.lang = 'en-US';
    // Chrome: wait for voiceschanged event
    window.speechSynthesis.onvoiceschanged = loadVoicesAndAssign;
    loadVoicesAndAssign();
}

// --- INIT ---
function init() {
    // Parse SVG matrix
    let transMatrix = $("#svgGroup").attr("transform").replace(/[^0-9.,\-]+/g, "");
    transMatrix = transMatrix.split(",");
    origMatrix = transMatrix.map(parseFloat);
    initialValue = origMatrix.slice(0);

    $(".zoomed").hide();

    // SVG path events
    document.querySelectorAll('path').forEach(svgPath => {
        svgPath.addEventListener('mouseover', event => startSpeechAndVib(event.target));
        svgPath.addEventListener('mouseleave', stopSpeechAndVib);
    });

    // SVG rectangle events
    document.querySelectorAll('rect').forEach(svgRect => {
        svgRect.addEventListener('mouseover', borderReact);
    });

    // Menu hover speech
    $('#uiDiv').on("mouseenter", function () {
        speakText('Menu');
    });

    // Hide background artwork
    $("#hide").click(function () {
        vibrate();
        if (hide) {
            $("#hide").text("Show Artwork");
            $("image").hide();
            speakText('Artwork now hidden');
            hide = false;
        } else {
            $("#hide").text("Hide Artwork");
            $("image").show();
            speakText('Artwork now displayed');
            hide = true;
        }
    });

    // Invert SVG colours
    $("#invert").click(function () {
        vibrate();
        if (invert) {
            $("svg").css("backgroundColor", "black");
            $("path").css("stroke", "white");
            invert = false;
        } else {
            $("path").css("stroke", "black");
            $("svg").css("backgroundColor", "white");
            invert = true;
        }
        speakText('Outline colours inverted');
    });

    // Make image greyscale
    $("#grey").click(function () {
        vibrate();
        if (desaturate) {
            $("#grey").text("Add Colours");
            $("#filter").addClass("filtered");
            speakText('Colours Removed');
            desaturate = false;
        } else {
            $("#grey").text("Remove Colours");
            $("#filter").removeClass("filtered");
            speakText('Colours Added');
            desaturate = true;
        }
    });

    // SVG zoom (double tap)
    $("#mySVG").on("click", function (event) {
        if (!tappedTwice) {
            tappedTwice = true;
            setTimeout(() => tappedTwice = false, 300);
            return false;
        }
        zoom(event);
    });
}

// --- SPEECH SYNTHESIS HELPERS ---
function speakText(text) {
    if ('speechSynthesis' in window && msg) {
        window.speechSynthesis.cancel(); // Clear queue to avoid Chrome bug[3]
        msg.text = text;
        // Chrome sometimes needs a brief delay after cancel
        setTimeout(() => window.speechSynthesis.speak(msg), 100);
    }
}

function startSpeechAndVib(pathElem) {
    vibrate();
    let desc = pathElem.querySelector('desc');
    if (desc && desc.firstChild && desc.firstChild.data) {
        speakText(desc.firstChild.data);
    }
}

function stopSpeechAndVib() {
    vibrate(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    curVib = 0;
}

// --- BORDER REACT ---
function borderReact() {
    vibrate(200);
    snd = new Audio("data:audio/wav;base64,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... ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=").play();
}

// --- ZOOM ---
function zoom(event) {
    let svg = document.getElementById("mySVG");
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = coordinateTransform(point, svg);

    if (!zoomed) {
        let newMatrixArr = origMatrix.slice(0, 4).map(n => n * 1.9);
        newMatrixArr[4] = origMatrix[4] - point.x;
        newMatrixArr[5] = origMatrix[5] - point.y;
        newMatrix = "matrix(" + newMatrixArr.join(' ') + ")";
        $("#svgGroup").attr("transform", newMatrix);
        zoomed = true;
        speakText('Zoomed in');
        $(".default").hide();
        $(".zoomed").show();
    } else {
        origMatrix = initialValue.slice(0);
        $("#svgGroup").attr("transform", "matrix(" + origMatrix + ")");
        zoomed = false;
        speakText('Zoomed out');
        $(".default").show();
        $(".zoomed").hide();
    }
}

function coordinateTransform(screenPoint, someSvgObject) {
    let CTM = someSvgObject.getScreenCTM();
    return screenPoint.matrixTransform(CTM.inverse());
}

// --- START ---
$(document).ready(init);
