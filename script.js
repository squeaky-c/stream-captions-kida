var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

let captionTimeout;
let lastFinalResult = "";
let isNewLine = true;
let caption = "";
var recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = true;

var captions = document.querySelector(".captions");

document.body.onclick = function () {
  recognition.start();
  console.log("Starting speech recognition");
};

recognition.onresult = function (event) {
  console.log(isNewLine ? "Starting new line" : "Continuing line");

  clearTimeout(captionTimeout);

  console.log("isfinal?", event.results[event.resultIndex].isFinal);

  if (isNewLine) {
    caption = event.results[event.resultIndex][0].transcript;
  } else {
    caption =
      lastFinalResult + " " + event.results[event.resultIndex][0].transcript;
  }

  captions.textContent = caption;
  captions.scrollTop = captions.scrollHeight;

  console.log(
    "New interim result:",
    event.results[event.resultIndex][0].transcript
  );

  if (event.results[event.resultIndex].isFinal) {
    isNewLine = false;
  }

  console.log(isNewLine ? "SHIT FUCK!" : "Waiting for more speech...");

  lastFinalResult = event.results[event.resultIndex - 1][0].transcript;

  console.log("Last final result:", lastFinalResult);

  captionTimeout = setTimeout(() => {
    captions.textContent = "";
    isNewLine = true;
    console.log(isNewLine ? "Next input is new line" : "TIMEOUT DIDN'T WORK");
    lastFinalResult = "";
  }, 4000);
};

recognition.onstart = function () {
  captions.textContent = "";
};

recognition.onend = function () {
  recognition.start();
};
