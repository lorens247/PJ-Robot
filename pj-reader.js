const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

function startListening() {
  recognition.start();
  document.getElementById("spokenText").innerText = "Listening...";
}

recognition.onresult = async function(event) {
  const transcript = event.results[0][0].transcript;
  document.getElementById("spokenText").innerText = `Heard: "${transcript}"`;

  const match = transcript.match(/read for me (.+?) (\d+):(\d+)/i);
  if (!match) {
    speakText("Sorry, I didn’t catch the Bible verse. Try saying, 'PJ, read for me John 3:16'");
    return;
  }

  const book = match[1];
  const chapter = match[2];
  const verse = match[3];

  const reference = `${book} ${chapter}:${verse}`;
  const response = await fetch(`https://bible-api.com/${book}+${chapter}:${verse}`);
  const data = await response.json();

  const verseText = data.text;
  document.getElementById("verse").innerText = verseText;
  speakText(`${reference}: ${verseText}`);
};

function speakText(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}
