var textInput = document.getElementById('wanakana-input');
var loadOutput = document.getElementById('loading-output');
var kanjiSpan = document.getElementById('characters');

var currentlyTyping;

function loadAnim() {
  textInput.classList.add('load');
  setTimeout(function() {
      textInput.classList.remove('load');
      textInput.style.opacity = 1;
  }, 1000);
}

function typeOut(typeString, time = 1) {
  let typeArray = typeString.split('');
  textInput.placeholder = '';
  currentlyTyping = typeString;
  for (let index in typeArray) {
    let char = typeArray[index];
    setTimeout(() => {
      if (typeString == currentlyTyping) {
        textInput.placeholder = textInput.placeholder + char;
      }
    }, ((time * 1000) / typeArray.length) * index);
  }
}