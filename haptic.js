// Vibration function
function vibrate() {
     window.navigator.vibrate(500); curVib = 500;
}

//Initialise function
function init() {
     var curVib = 0;
     var tappedTwice = false, zoomed = false;
     var invert = true, hide=true, desaturate=true;
     var snd, newMatrix;
     var paths = document.querySelector('path');
     var transMatrix = $("#svgGroup").attr("transform").replace(/[^0-9.,]+/, "");
     transMatrix = transMatrix.split(",");
     var origMatrix = [parseFloat(transMatrix[0]), parseFloat(transMatrix[1]), parseFloat(transMatrix[2]), parseFloat(transMatrix[3]), parseFloat(transMatrix[4]), parseFloat(transMatrix[5])];
     var initialValue = origMatrix.slice(0);
  
     if ('speechSynthesis' in window) {
          var msg = new SpeechSynthesisUtterance();
          var voices = window.speechSynthesis.getVoices();
          var vib = window.setInterval(vibTime, 150);
     }

     $(".zoomed").hide();
     $("#mySVG").on("mouseover", function() { vibStart(); });
     $("#mySVG").on("mouseleave", function() { vibStop(); });
     
     $("#mySVG").on("click", function() {
          if(!tappedTwice) {
                  tappedTwice = true;
                  setTimeout( function() {
                     tappedTwice = false;
                     }, 300 );
                  return false;
          }
          Event.preventDefault();
          zoom();
     });
     
     $("#hide").click ( function() {
            vibrate();
          if (hide == true) {
              $("#hide").text("Show");
              $("image").hide();
              if ('speechSynthesis' in window) {
                  msg.text = 'Hide background'; speechSynthesis.speak(msg);
              }
              hide = false;
          } else if (hide == false) {
               $("#hide").text("Hide");
               $("image").show();
               if ('speechSynthesis' in window) {
              msg.text = 'Show background'; speechSynthesis.speak(msg);
               }
              hide = true;
          }  
     });
     
     $("#invert").click( function() {
            vibrate();
          if (invert == true) {
                   for (var i = 0; i<paths.length; i += 1) {
                  paths[i].style.stroke = "white";
                  }
              $("svg").css("backgroundColor", "black");
              invert = false;
          } else if (invert == false) {
               for (var i = 0; i<paths.length; i += 1) {
                  paths[i].style.stroke = "black";
          }
          $("svg").css("backgroundColor", "white");
          invert = true;
          }
          if ('speechSynthesis' in window) {
            msg.text = 'Invert colours'; 
            speechSynthesis.speak(msg);
          }
     });
     
          $("#grey").click(function() {
                 vibrate();
              if (desaturate == true) {
                   $("#grey").text("Colour");
                   $("#filter").addClass("filtered");
                   desaturate = false;
                  if ('speechSynthesis' in window) {
                    msg.text = 'Greyscale'; speechSynthesis.speak(msg);
                  }
              } else if (desaturate == false) {
                    $("#grey").text("Grey");
                    $("#filter").removeClass("filtered");
                   desaturate = true;
                  if ('speechSynthesis' in window) {
                    msg.text = 'Colour'; speechSynthesis.speak(msg);
                  }
              }
           });
     
     function vibTime() {
          window.navigator.vibrate(curVib);
     }

     function vibStart(e) {
          e = document.elementFromPoint(e.touches.item(0).clientX, e.touches.item(0).clientY);
          e.preventDefault();
          curVib = 0;
          for (var i = 0; i<paths.length +1; i += 1) {
                  if (e.id == "path" + i) {
                              vibrate();
                              if ('speechSynthesis' in window) {
                                msg.text = document.getElementById("desc" + i).firstChild.data;
                                speechSynthesis.speak(msg);
                                msg.addEventListener('end', function () {
                                    speechSynthesis.cancel();
                                });
                              }
                  }
          }
          if (e.id == "borderRect") {
                  vibrate();
                  snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=").play();
          }
          if (e.id == "uiDiv") {
               if ('speechSynthesis' in window) {
                  msg.text = 'Menu'; speechSynthesis.speak(msg);
              }
          }
     }
     
     function zoom() {
          var svg = document.getElementById("mySVG");
          var point = svg.createSVGPoint();
          point.x = Event.touches.item(0).clientX; 
          point.y = Event.touches.item(0).clientY;
          point = coordinateTransform(point, svg);
          if (zoomed == false) {
                    for (var i=0; i<origMatrix.length; i++) {
                    origMatrix[i] *= 1.9;
                    }
               origMatrix[4] = (origMatrix[4] - point.x);
               origMatrix[5] = (origMatrix[5] - point.y);
               newMatrix = "matrix("  + origMatrix.join(' ') + ")";
               $("#svgGroup").attr("transform", newMatrix);
               zoomed = true;
               if ('speechSynthesis' in window) {
                  msg.text = 'Zoomed in'; speechSynthesis.speak(msg);
               }
               $(".default").hide();
               $(".zoomed").show();
          } else if (zoomed == true) {
               origMatrix = initialValue.slice(0);
               $("#svgGroup").attr("transform", "matrix(" + origMatrix + ")");
               zoomed = false;
               if ('speechSynthesis' in window) {
                  msg.text = 'Zoomed out'; speechSynthesis.speak(msg);
               }
               $(".default").show();
               $(".zoomed").hide();
          }
     }
     
     function coordinateTransform(screenPoint, someSvgObject) {
          var CTM = someSvgObject.getScreenCTM(); 
          return screenPoint.matrixTransform( CTM.inverse() );
     }
     
     function vibStop() {
          event.preventDefault();
          window.navigator.vibrate(0);
          speechSynthesis.cancel();
          curVib = 0;
     }
}