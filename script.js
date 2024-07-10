document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const grid = document.getElementById("grid");
    const rowSumsContainer = document.getElementById("row-sums");
    const columnSumsContainer = document.getElementById("column-sums");
    const resetButton = document.getElementById("reset-button");
    const startTimerButton = document.getElementById("start-timer-button");
    const stopTimerButton = document.getElementById("stop-timer-button");
    const timerDisplay = document.getElementById("timer-display");
    const deathModal = document.getElementById("death-modal");
    const closeModal = document.getElementById("close-modal");
    const themeToggleCheckbox = document.getElementById("theme-toggle-checkbox");
    const themeLabel = document.getElementById("theme-label");
    const settingsButton = document.getElementById("settings-button");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsModal = document.getElementById("close-settings-modal");
    const deleteCookiesButton = document.getElementById("delete-cookies-button");
    const saveSettingsButton = document.getElementById("save-settings-button");
    const timerLengthInput = document.getElementById("timer-length");
    const boardSizeInput = document.getElementById("board-size");
    const skullRateInput = document.getElementById("skull-rate");
    const seedInput = document.getElementById("seed");
    const kofiButton = document.getElementById("kofi-button");
    const resetModal = document.getElementById("reset-modal");
    const confirmResetButton = document.getElementById("confirm-reset-button");
    const cancelResetButton = document.getElementById("cancel-reset-button");

    const appleEmoji = "🍎";
    const skullEmoji = "💀";

    let seed = null;
    let gridSize = 7;
    let skullSpawnRate = 0.3;
    let timeRemaining = 60;
    let timer;
    let timeLeft = 60;
    let darkMode = true;

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) === 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }
    
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function saveSettingsToCookies() {
        setCookie("timerLength", timeLeft, 365);
        setCookie("gridSize", gridSize, 365);
        setCookie("skullSpawnRate", skullSpawnRate, 365);
        setCookie("seed", seed, 365);
        setCookie("darkMode", darkMode, 365);
    }

    function saveGameState() {
        saveSettingsToCookies();
        const cells = Array.from(document.querySelectorAll(".cell"));
        const gameState = cells.map(cell => ({
            flipped: cell.classList.contains("flipped"),
            value: cell.dataset.value
        }));
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    function loadSettingsFromCookies() {
        const timerLengthCookie = getCookie("timerLength");
        const gridSizeCookie = getCookie("gridSize");
        const skullSpawnRateCookie = getCookie("skullSpawnRate");
        const seedCookie = getCookie("seed");
        const darkModeCookie = getCookie("darkMode");
    
        if (timerLengthCookie) {
            timeLeft = parseInt(timerLengthCookie);
        }
        if (gridSizeCookie) {
            gridSize = parseInt(gridSizeCookie);
        }
        if (skullSpawnRateCookie) {
            skullSpawnRate = parseFloat(skullSpawnRateCookie);
        }
        if (seedCookie) {
            seed = seedCookie !== "null" ? seedCookie : null;
        }
        if (darkModeCookie) {
            darkMode = darkModeCookie === "true";
            if(darkMode){
                themeToggleCheckbox.checked = true;
                body.classList.add("dark-mode");
                themeLabel.textContent = "🌜";
            }
            else {
                themeToggleCheckbox.checked = false;
                body.classList.remove("dark-mode");
                themeLabel.textContent = "🌞";
            }

        }
    }

    function loadGameState() {
        loadSettingsFromCookies();
        const gameState = JSON.parse(localStorage.getItem("gameState"));
        if (!gameState) return false;
    
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;
    
        let rowSums = new Array(gridSize).fill(0);
        let columnSums = new Array(gridSize).fill(0);

        gameState.forEach((cellState, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            if (cellState.flipped) {
                cell.classList.add("flipped");
                cell.textContent = cellState.value;
            } 
            else {
                cell.textContent = `${getColumnLetter(col)}${row + 1}`;
            }
            cell.dataset.value = cellState.value;
            cell.addEventListener("click", () => flipCell(cell));
            grid.appendChild(cell);

            if (cell.dataset.value === skullEmoji) {
                rowSums[row]++;
                columnSums[col]++;
            }
        });

        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.classList.add("hide");
            sumElement.textContent = rowSums[i];
            rowSumsContainer.appendChild(sumElement);
        }

        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.classList.add("hide");
            sumElement.textContent = columnSums[i];
            columnSumsContainer.appendChild(sumElement);
        }

        stopTimerButton.disabled = true;
        stopTimer();

        return true;
    }

    function generateRandomSeed() {
        return Math.floor(Math.random() * 1000000);
    }

    function seededRandom(seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

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
        return String.fromCharCode(65 + index);
    }

    function flipCell(cell) {
        if (!cell.classList.contains("flipped")) {
            cell.classList.add("flipped");
            cell.textContent = cell.dataset.value;
    
            if (cell.dataset.value === "💀") {
                showModal();
            }

            saveGameState();
        }
    }

    function startTimer() {
        clearInterval(timer);
        timerDisplay.textContent = timeRemaining;
        stopTimerButton.disabled = false;
        startTimerButton.disabled = true;
        showSums();
        timer = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                showModal();
                stopTimerButton.disabled = true;
                startTimerButton.disabled = false;
                hideSums();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timeRemaining = timeLeft;
        timerDisplay.textContent = timeLeft;
        startTimerButton.disabled = false;
        stopTimerButton.disabled = true;
        hideSums();
    }

    function showModal() {
        deathModal.style.display = "block";
    }

    function hideSums() {
        const sums = document.querySelectorAll('.sum');
        sums.forEach(sum => sum.classList.add('hide'));
    }
    
    function showSums() {
        const sums = document.querySelectorAll('.sum');
        sums.forEach(sum => sum.classList.remove('hide'));
    }

    function initializeGrid() {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;
        if (seed === null) {
            seed = generateRandomSeed();
        }

        const cellValues = [];

        let seedValue = parseInt(seed);
        let randomFunction = (tempSeed) => seededRandom(tempSeed);

        for (let i = 0; i < gridSize * gridSize; i++) {
            cellValues.push(randomFunction(seedValue + i) < skullSpawnRate ? skullEmoji : appleEmoji);
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
            cell.textContent = `${getColumnLetter(col)}${row + 1}`;
            grid.appendChild(cell);

            if (cellValues[i] === skullEmoji) {
                rowSums[row]++;
                columnSums[col]++;
            }
        }

        rowSumsContainer.innerHTML = '';
        columnSumsContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.classList.add("hide");
            sumElement.textContent = rowSums[i];
            rowSumsContainer.appendChild(sumElement);
        }

        for (let i = 0; i < gridSize; i++) {
            const sumElement = document.createElement("div");
            sumElement.classList.add("sum");
            sumElement.classList.add("hide");
            sumElement.textContent = columnSums[i];
            columnSumsContainer.appendChild(sumElement);
        }

        stopTimerButton.disabled = true;
        stopTimer();
        hideSums();
    }

    window.onclick = function(event) {
        if (event.target == deathModal) {
            deathModal.style.display = "none";

        }
        if(event.target == settingsModal){
            settingsModal.style.display = "none";
        }
        if (event.target == resetModal) {
            resetModal.style.display = "none";
        }
        stopTimer();
    };

    themeToggleCheckbox.addEventListener("change", () => {
        if (themeToggleCheckbox.checked) {
            body.classList.add("dark-mode");
            themeLabel.textContent = "🌜";
        } else {
            body.classList.remove("dark-mode");
            themeLabel.textContent = "🌞";
        }
        darkMode = themeToggleCheckbox.checked;
        saveSettingsToCookies();
    });

    closeModal.onclick = function() {
        deathModal.style.display = "none";
        stopTimer();
    };

    settingsButton.addEventListener("click", () => {
        settingsModal.style.display = "block";
        timerLengthInput.value = timeLeft;
        boardSizeInput.value = gridSize;
        skullRateInput.value = skullSpawnRate * 100;
        seedInput.value = seed !== null ? seed : generateRandomSeed();
        stopTimer();
    });

    closeSettingsModal.onclick = function() {
        settingsModal.style.display = "none";
    };
    
    saveSettingsButton.addEventListener("click", () => {
        const timerLength = parseInt(timerLengthInput.value);
        const boardSize = parseInt(boardSizeInput.value);
        const skullRate = parseInt(skullRateInput.value);
        const seedValue = seedInput.value.trim();

        timeLeft = timerLength;

        if(boardSize != gridSize){
            gridSize = boardSize;
            initializeGrid();
        }
        skullSpawnRate = skullRate / 100;
        if(seed != seedValue){
            seed = seedValue;
            initializeGrid();
        }
        stopTimer();
        saveGameState();

        settingsModal.style.display = "none";
    });

    deleteCookiesButton.addEventListener("click", () => {
        deleteCookie("timerLength");
        deleteCookie("gridSize");
        deleteCookie("skullSpawnRate");
        deleteCookie("seed");
        localStorage.clear();
    });

    resetButton.addEventListener("click", () => {
        resetModal.style.display = "block";
    });

    cancelResetButton.onclick = function() {
        resetModal.style.display = "none";
    };

    confirmResetButton.onclick = function() {
        seed = generateRandomSeed();
        initializeGrid();
        saveGameState();
        resetModal.style.display = "none";
    };

    startTimerButton.addEventListener("click", startTimer);
    stopTimerButton.addEventListener("click", stopTimer);

    kofiButton.addEventListener("click", () => {
        window.open("https://ko-fi.com/hilovids/donate", "_blank");
    });


    if (!loadGameState()) {
        initializeGrid();
    }
    setInitialTheme();

});