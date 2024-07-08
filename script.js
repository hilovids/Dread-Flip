document.addEventListener("DOMContentLoaded", () => {
    const gridSize = 7;
    const grid = document.getElementById("grid");
    const rowSumsContainer = document.getElementById("row-sums");
    const columnSumsContainer = document.getElementById("column-sums");
    const resetButton = document.getElementById("reset-button");
    const startTimerButton = document.getElementById("start-timer-button");
    const stopTimerButton = document.getElementById("stop-timer-button");
    const timerDisplay = document.getElementById("timer-display");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const themeToggleCheckbox = document.getElementById("theme-toggle-checkbox");
    const themeLabel = document.getElementById("theme-label");
    const body = document.body;
    const appleEmoji = "🍎";
    const skullEmoji = "💀";
    let timer;
    let timeLeft = 30;

    function setInitialTheme() {
        if (themeToggleCheckbox.checked) {
            body.classList.add("dark-mode");
            themeLabel.textContent = "🌜";
        } else {
            body.classList.remove("dark-mode");
            themeLabel.textContent = "🌞";
        }
    }

    function getColumnLetter(index) {
        return String.fromCharCode(65 + index); // 65 is the char code for 'A'
    }

    function initializeGrid() {
        grid.innerHTML = '';
        rowSumsContainer.innerHTML = '';
        columnSumsContainer.innerHTML = '';

        const cellValues = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            cellValues.push(Math.random() < 0.3 ? skullEmoji : appleEmoji);
        }

        let rowSums = new Array(gridSize).fill(0);
        let columnSums = new Array(gridSize).fill(0);

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.value = cellValues[i];
            cell.addEventListener("click", () => flipCell(cell));
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            cell.textContent = `${getColumnLetter(col)}${row + 1}`; // Set coordinate label
            grid.appendChild(cell);

            if (cellValues[i] === skullEmoji) {
                rowSums[row]++;
                columnSums[col]++;
            }
        }

        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.textContent = rowSums[i];
            rowSumsContainer.appendChild(sumElement);
        }

        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.textContent = columnSums[i];
            columnSumsContainer.appendChild(sumElement);
        }

        hideSums();
    }

    function flipCell(cell) {
        if (!cell.classList.contains("flipped")) {
            cell.classList.add("flipped");
            cell.textContent = cell.dataset.value;
    
            // Check if the selected tile is a skull
            if (cell.dataset.value === "💀") {
                showModal();
            }
        }
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        startTimerButton.disabled = true;
        showSums();
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                showModal();
                startTimerButton.disabled = false;
                hideSums();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        startTimerButton.disabled = false;
        hideSums();
    }

    function showModal() {
        modal.style.display = "block";
    }

    function hideSums() {
        const sums = document.querySelectorAll('.sum');
        sums.forEach(sum => sum.classList.add('hide'));
    }
    
    function showSums() {
        const sums = document.querySelectorAll('.sum');
        sums.forEach(sum => sum.classList.remove('hide'));
    }

    themeToggleCheckbox.addEventListener("change", () => {
        if (themeToggleCheckbox.checked) {
            body.classList.add("dark-mode");
            themeLabel.textContent = "🌜";
        } else {
            body.classList.remove("dark-mode");
            themeLabel.textContent = "🌞";
        }
    });

    closeModal.onclick = function() {
        modal.style.display = "none";
        stopTimer();
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            stopTimer();
        }
    };

    resetButton.addEventListener("click", initializeGrid);
    startTimerButton.addEventListener("click", startTimer);
    stopTimerButton.addEventListener("click", stopTimer);

    setInitialTheme();
    initializeGrid();
});