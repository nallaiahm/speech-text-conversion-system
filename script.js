function showPage(pageId){
document.querySelectorAll('.page').forEach(function(page){
page.style.display='none';
});
document.getElementById(pageId).style.display='block';
}

document.addEventListener('DOMContentLoaded',function(){

var speechSynthesis=window.speechSynthesis;
var speechUtterance=new SpeechSynthesisUtterance();

var speakButton=document.getElementById('speakButton');
var pauseResumeButton=document.getElementById('pauseResumeButton');

var textInput=document.getElementById('textInput');
var rateInput=document.getElementById('rateInput');
var pitchInput=document.getElementById('pitchInput');

var historyList=document.getElementById('historyList');

rateInput.addEventListener('input',function(){
speechUtterance.rate=parseFloat(rateInput.value);
});

pitchInput.addEventListener('input',function(){
speechUtterance.pitch=parseFloat(pitchInput.value);
});

speakButton.addEventListener('click',function(){

var text=textInput.value.trim();
var lang=document.querySelector('input[name="language"]:checked').value;

if(text!==''){
textToSpeech(text,lang);
}else{
textInput.style.borderColor='red';

setTimeout(function(){
textInput.style.borderColor='#007bff';
},1000);
}

});

pauseResumeButton.addEventListener('click',function(){

if(speechSynthesis.paused){

speechSynthesis.resume();
pauseResumeButton.textContent='Pause';

}else{

speechSynthesis.pause();
pauseResumeButton.textContent='Resume';

}

});

var clearHistoryButton=document.getElementById('clearHistoryButton');

clearHistoryButton.addEventListener('click',function(){

localStorage.removeItem('speechHistory');
renderHistory();
alert('Speech history cleared!');

});

function saveSpeechToHistory(text,lang){

var history=JSON.parse(localStorage.getItem('speechHistory'))||[];

history.unshift({text:text,lang:lang});

localStorage.setItem('speechHistory',JSON.stringify(history));

renderHistory();

}

function loadSpeechHistory(){

return JSON.parse(localStorage.getItem('speechHistory'))||[];

}

function renderHistory(){

historyList.innerHTML='';

var history=loadSpeechHistory();

history.forEach(function(item){

var historyItem=document.createElement('div');

historyItem.textContent=item.text+' ('+item.lang+')';

historyList.appendChild(historyItem);

});

}

renderHistory();

function textToSpeech(text,lang){

var speechUtterance=new SpeechSynthesisUtterance(text);

speechUtterance.lang=lang;

speechSynthesis.speak(speechUtterance);

speechUtterance.onend=function(){

textInput.value='';
pauseResumeButton.textContent='Pause';

saveSpeechToHistory(text,lang);

};

}

// Speech to Text

var startRecordingButton=document.getElementById('startRecordingButton');

var stopRecordingButton=document.getElementById('stopRecordingButton');

var transcript=document.getElementById('transcript');

var recognition;

if(window.SpeechRecognition||window.webkitSpeechRecognition){

recognition=new (window.SpeechRecognition||window.webkitSpeechRecognition)();

recognition.continuous=true;
recognition.interimResults=true;

recognition.onresult=function(event){

var transcriptText='';

for(var i=event.resultIndex;i<event.results.length;i++){

transcriptText+=event.results[i][0].transcript;

}

transcript.value=transcriptText;

};

}

startRecordingButton.addEventListener('click',function(){

if(recognition){

recognition.start();

startRecordingButton.disabled=true;

stopRecordingButton.disabled=false;

}

});

stopRecordingButton.addEventListener('click',function(){

if(recognition){

recognition.stop();

startRecordingButton.disabled=false;

stopRecordingButton.disabled=true;

}

});

var clearTextButton=document.getElementById('clearTextButton');

clearTextButton.addEventListener('click',function(){

transcript.value='';

});

});
