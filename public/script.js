function openApp(appName) {
  const win = document.createElement('div');
  win.className = 'window';
  win.style.top = '100px';
  win.style.left = '100px';

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerText = appName;
  win.appendChild(header);

  const content = document.createElement('div');
  content.innerHTML = getAppContent(appName);
  win.appendChild(content);

  document.body.appendChild(win);
  makeDraggable(win, header);
}

function getAppContent(app) {
  if (app === 'notes') {
    return `<textarea id="noteArea"></textarea><button onclick="saveNote()">Save</button>`;
  }
  if (app === 'calculator') {
    return `<input id="calcInput"/><button onclick="calculate()">=</button><div id="calcResult"></div>`;
  }
  return 'App not found';
}

function saveNote() {
  const note = document.getElementById('noteArea').value;
  fetch('/api/saveNote', {
    method: 'POST',
    body: JSON.stringify({ note }),
    headers: { 'Content-Type': 'application/json' }
  });
}

function calculate() {
  const input = document.getElementById('calcInput').value;
  document.getElementById('calcResult').innerText = eval(input);
}

function makeDraggable(win, header) {
  let offsetX, offsetY;
  header.onmousedown = function(e) {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.onmousemove = function(e) {
      win.style.left = e.clientX - offsetX + 'px';
      win.style.top = e.clientY - offsetY + 'px';
    };
    document.onmouseup = function() {
      document.onmousemove = null;
    };
  };
}
