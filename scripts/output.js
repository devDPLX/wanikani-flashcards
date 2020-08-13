var textInput = document.getElementById('wanakana-input');
var loadOutput = document.getElementById('loading-output');
var kanjiSpan = document.getElementById('characters');

var isFading = false;

function popout() {
  if (isFading) return;
  isFading = true;
  loadOutput.classList.add('popup-in');
  setTimeout(function() {
    loadOutput.classList.remove('popup-in');
    loadOutput.style.opacity = 1;
    loadOutput.classList.add('popup-out');
    setTimeout(function() {
      loadOutput.style.opacity = 0;
      loadOutput.classList.remove('popup-out');
      isFading = false;
    }, 800);
  }, 200);
}

function outputCharacters(subject) {
  kanjiSpan.textContent = subject.characters;
  switch (subject.object) {
    case 'radical':
      kanjiSpan.style.color = '#6495ED'; break;
    case 'kanji':
      kanjiSpan.style.color = '#FF1493'; break;
    case 'vocabulary':
      kanjiSpan.style.color = '#9400D3'; break;
  }
}

function outputError(errorString) {
  loadOutput.style.color = 'red';
  loadOutput.innerHTML = errorString
  popout();
}

function outputValid(validString) {
  loadOutput.style.color = 'green';
  loadOutput.innerHTML = validString
  popout();
}

function clear() {
  textInput.value = '';
}

function clearAndFocus() {
  clear();
  focus();
}