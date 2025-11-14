var inputEl = document.getElementById('inputText');
var parseBtn = document.getElementById('parseBtn');
var topZone = document.getElementById('topZone');
var leftZone = document.getElementById('leftZone');
var wordsDisplay = document.getElementById('wordsDisplay');
var chipTemplate = document.getElementById('chipTemplate');

parseBtn.addEventListener('click', handleParse);

topZone.addEventListener('dragover', handleDragOver);
topZone.addEventListener('dragenter', handleDragEnter);
topZone.addEventListener('dragleave', handleDragLeave);
topZone.addEventListener('drop', handleDrop);

leftZone.addEventListener('dragover', handleDragOver);
leftZone.addEventListener('dragenter', handleDragEnter);
leftZone.addEventListener('dragleave', handleDragLeave);
leftZone.addEventListener('drop', handleDrop);

function handleParse() {
    var text = inputEl.value;
    if (!text) {
        resetBoards();
        return;
    }
    
    var words = text.split('-');
    var lowerWords = [];
    var upperWords = [];
    var numbers = [];
    
    for (var i = 0; i < words.length; i++) {
        var word = words[i].trim();
        if (!word) continue;
        
        if (!isNaN(word)) {
            numbers.push(Number(word));
        } else {
            var firstChar = word[0];
            if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
                upperWords.push(word);
            } else {
                lowerWords.push(word);
            }
        }
    }
    
    upperWords.sort();
    lowerWords.sort();
    numbers.sort(function(a, b) { return a - b; });
    
    var items = [];
    var index = 0;
    
    for (var i = 0; i < lowerWords.length; i++) {
        items.push({
            key: 'a' + (i + 1),
            value: lowerWords[i],
            order: index++
        });
    }
    
    for (var i = 0; i < upperWords.length; i++) {
        items.push({
            key: 'b' + (i + 1),
            value: upperWords[i],
            order: index++
        });
    }
    
    for (var i = 0; i < numbers.length; i++) {
        items.push({
            key: 'n' + (i + 1),
            value: String(numbers[i]),
            order: index++
        });
    }
    
    renderItems(items);
}

function resetBoards() {
    topZone.innerHTML = '';
    leftZone.innerHTML = '';
    wordsDisplay.innerHTML = '';
}

function renderItems(items) {
    resetBoards();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var chip = createChipElement(item);
        topZone.appendChild(chip);
    }
}

function createChipElement(data) {
    var chip = chipTemplate.content.firstElementChild.cloneNode(true);
    chip.setAttribute('data-id', data.key);
    chip.setAttribute('data-order', data.order);
    chip.setAttribute('data-zone', 'top');
    chip.setAttribute('data-key', data.key);
    chip.setAttribute('data-value', data.value);
    chip.style.backgroundColor = 'grey';
    chip.style.color = 'white';
    chip.querySelector('.chip-key').textContent = data.key;
    chip.querySelector('.chip-value').textContent = data.value;
    chip.addEventListener('dragstart', handleDragStart);
    chip.addEventListener('dragend', handleDragEnd);
    chip.addEventListener('click', handleChipClick);
    return chip;
}

function handleDragStart(event) {
    var chip = event.target.closest('.chip');
    if (!chip) return;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', chip.getAttribute('data-id'));
    chip.classList.add('dragging');
}

function handleDragEnd(event) {
    var chip = event.target.closest('.chip');
    if (!chip) return;
    chip.classList.remove('dragging');
    topZone.classList.remove('drag-over');
    leftZone.classList.remove('drag-over');
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(event) {
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    var targetZone = event.currentTarget;
    targetZone.classList.remove('drag-over');
    
    var chipId = event.dataTransfer.getData('text/plain');
    if (!chipId) return;
    
    var chip = document.querySelector('.chip[data-id="' + chipId + '"]');
    if (!chip) return;
    
    if (targetZone === leftZone) {
        leftZone.appendChild(chip);
        chip.setAttribute('data-zone', 'left');
        
        var zoneRect = leftZone.getBoundingClientRect();
        var x = event.clientX - zoneRect.left - 50;
        var y = event.clientY - zoneRect.top - 20;
        
        if (x < 0) x = 10;
        if (y < 0) y = 10;
        
        chip.style.position = 'absolute';
        chip.style.left = x + 'px';
        chip.style.top = y + 'px';
        
        var colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink'];
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        chip.style.backgroundColor = randomColor;
        chip.style.color = 'white';
    } else if (targetZone === topZone) {
        chip.style.position = '';
        chip.style.left = '';
        chip.style.top = '';
        var order = Number(chip.getAttribute('data-order'));
        var children = topZone.children;
        var inserted = false;
        for (var i = 0; i < children.length; i++) {
            if (Number(children[i].getAttribute('data-order')) > order) {
                topZone.insertBefore(chip, children[i]);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            topZone.appendChild(chip);
        }
        chip.setAttribute('data-zone', 'top');
        chip.style.backgroundColor = 'lightgrey';
        chip.style.color = 'black';
    }
}

function handleChipClick(event) {
    var chip = event.currentTarget;
    if (chip.getAttribute('data-zone') !== 'left') {
        return;
    }
    
    var word = chip.getAttribute('data-value');
    var color = chip.style.backgroundColor;
    
    var wordItem = document.createElement('div');
    wordItem.className = 'word-item';
    wordItem.textContent = word;
    wordItem.style.color = color;
    wordsDisplay.appendChild(wordItem);
}

resetBoards();
