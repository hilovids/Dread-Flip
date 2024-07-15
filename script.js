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
    const settingsButton = document.getElementById("settings-button");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsModal = document.getElementById("close-settings-modal");
    const deleteCookiesButton = document.getElementById("delete-cookies-button");
    const saveSettingsButton = document.getElementById("save-settings-button");
    const timerLengthInput = document.getElementById("timer-length");
    const boardSizeInput = document.getElementById("board-size");
    const numSkullsInput = document.getElementById("num-skulls");
    const seedInput = document.getElementById("seed");
    const kofiButton = document.getElementById("kofi-button");
    const resetModal = document.getElementById("reset-modal");
    const confirmResetButton = document.getElementById("confirm-reset-button");
    const cancelResetButton = document.getElementById("cancel-reset-button");
    const flipSkullButton = document.getElementById("flip-skull-button");
    const flipAppleButton = document.getElementById("flip-apple-button");
    const customizeButton = document.getElementById("customize-button");
    const customizeSidebar = document.getElementById("customize-sidebar");
    const backgroundColorPicker = document.getElementById("background-color-picker");
    const headerTextColorPicker = document.getElementById("header-text-color-picker");
    const infoPanelColorPicker = document.getElementById("info-panel-color-picker");
    const infoPanelTextColorPicker = document.getElementById("info-panel-text-color-picker");
    const gridUnflippedColorPicker = document.getElementById("grid-unflipped-color-picker");
    const gridFlippedColorPicker = document.getElementById("grid-flipped-color-picker");
    const gridTextColorPicker = document.getElementById("grid-text-color-picker");
    const gridHeaderColorPicker = document.getElementById("grid-header-color-picker");
    const gridHeaderTextColorPicker = document.getElementById("grid-header-text-color-picker");
    const skullEmojiPicker = document.getElementById("skull-emoji-picker");
    const appleEmojiPicker = document.getElementById("apple-emoji-picker");
    const zombieEmojiPicker = document.getElementById("zombie-emoji-picker");
    const resetCustomizationsButton = document.getElementById("reset-customizations-button");
    const closeCustomizeButton = document.getElementById("close-customize-button");
    const skullEmojiPickerElement = document.getElementById("skull-emoji-picker-element");
    const appleEmojiPickerElement = document.getElementById("apple-emoji-picker-element");
    const zombieEmojiPickerElement = document.getElementById("zombie-emoji-picker-element");

    let skullEmoji = getCookie("skullEmoji") || "💀";
    let appleEmoji = getCookie("appleEmoji") || "🍎";
    let zombieEmoji = getCookie("zombieEmoji") || "🧟";

    const defaultSettings = {
        backgroundColor: "#333333",
        headerTextColor: "#ffffff",
        infoPanelColor: "#1C611E",
        infoPanelTextColor: "#ffffff",
        gridUnflippedColor: "#4caf50",
        gridFlippedColor: "#ffffff",
        gridTextColor: "#c8f8a9",
        gridHeaderColor: "#2196f3",
        gridHeaderTextColor: "#ffffff",
        skullEmoji: "💀",
        appleEmoji: "🍎",
        zombieEmoji: "🧟"
    };

    let seed = null;
    let gridSize = 8;
    let numSkulls = 22;
    let timeRemaining = 60;
    let timer;
    let timeLeft = 60;

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
        setCookie("numSkulls", numSkulls, 365);
        setCookie("seed", seed, 365);
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
        const numSkullsCookie = getCookie("numSkulls");
        const seedCookie = getCookie("seed");
    
        if (timerLengthCookie) {
            timeLeft = parseInt(timerLengthCookie);
        }
        if (gridSizeCookie) {
            gridSize = parseInt(gridSizeCookie);
        }
        if (numSkullsCookie) {
            numSkulls = parseInt(numSkullsCookie);
        }
        if (seedCookie) {
            seed = seedCookie !== "null" ? seedCookie : null;
        }

        const backgroundColor = getCookie("backgroundColor");
        const headerTextColor = getCookie("headerTextColor");
        const infoPanelColor = getCookie("infoPanelColor");
        const infoPanelTextColor = getCookie("infoPanelTextColor");
        const gridUnflippedColor = getCookie("gridUnflippedColor");
        const gridFlippedColor = getCookie("gridFlippedColor");
        const gridTextColor = getCookie("gridTextColor");
        const gridHeaderColor = getCookie("gridHeaderColor");
        const gridHeaderTextColor = getCookie("gridHeaderTextColor");
        const savedSkullEmoji = getCookie("skullEmoji");
        const savedAppleEmoji = getCookie("appleEmoji");
        const savedZombieEmoji = getCookie("zombieEmoji");
        
        if (backgroundColor) {
            document.body.style.backgroundColor = backgroundColor;
            backgroundColorPicker.value = backgroundColor;
        } else {
            backgroundColorPicker.value = defaultSettings.backgroundColor;
        }
        if (headerTextColor) {
            document.querySelector("h1").style.color = headerTextColor;
            headerTextColorPicker.value = headerTextColor;
        } 
        else {
            headerTextColorPicker.value = defaultSettings.headerTextColor;
        }
        if (infoPanelColor) {
            document.querySelector(".info-panel").style.backgroundColor = infoPanelColor;
            infoPanelColorPicker.value = infoPanelColor;
        } 
        else {
            infoPanelColorPicker.value = defaultSettings.infoPanelColor;
        }
        if (infoPanelTextColor) {
            document.querySelector(".info-panel").style.color = infoPanelTextColor;
            infoPanelTextColorPicker.value = infoPanelTextColor;
        } 
        else {
            infoPanelTextColorPicker.value = defaultSettings.infoPanelTextColor;
        }
        if (gridUnflippedColor) {
            document.documentElement.style.setProperty('--grid-unflipped-color', gridUnflippedColor);
            gridUnflippedColorPicker.value = gridUnflippedColor;
        } 
        else {
            gridUnflippedColorPicker.value = defaultSettings.gridUnflippedColor;
        }
        if (gridFlippedColor) {
            document.documentElement.style.setProperty('--grid-flipped-color', gridFlippedColor);
            gridFlippedColorPicker.value = gridFlippedColor;
        } 
        else {
            gridFlippedColorPicker.value = defaultSettings.gridFlippedColor;
        }
        if (gridTextColor) {
            document.documentElement.style.setProperty('--grid-text-color', gridTextColor);
            gridTextColorPicker.value = gridTextColor;
        } 
        else {
            gridTextColorPicker.value = defaultSettings.gridTextColor;
        }
        if (gridHeaderColor) {
            document.documentElement.style.setProperty('--grid-header-color', gridHeaderColor);
            gridHeaderColorPicker.value = gridHeaderColor;
        } 
        else {
            gridHeaderColorPicker.value = defaultSettings.gridHeaderColor;
        }
        if (gridHeaderTextColor) {
            document.documentElement.style.setProperty('--grid-header-text-color', gridHeaderTextColor);
            gridHeaderTextColorPicker.value = gridHeaderTextColor;
        } 
        else {
            gridHeaderTextColorPicker.value = defaultSettings.gridHeaderTextColor;
        }
        if (savedSkullEmoji) {
            updateEmoji("skull", savedSkullEmoji);
            skullEmojiPicker.value = savedSkullEmoji;
        } 
        else {
            skullEmojiPicker.value = defaultSettings.skullEmoji;
        }
        if (savedAppleEmoji) {
            updateEmoji("apple", savedAppleEmoji);
            appleEmojiPicker.value = savedAppleEmoji;
        } 
        else {
            appleEmojiPicker.value = defaultSettings.appleEmoji;
        }
        if (savedZombieEmoji) {
            updateEmoji("zombie", savedZombieEmoji);
            zombieEmojiPicker.value = savedZombieEmoji;
        } else {
            zombieEmojiPicker.value = defaultSettings.zombieEmoji;
        }

        skullEmoji = savedSkullEmoji || skullEmoji;
        appleEmoji = savedAppleEmoji || appleEmoji;
        zombieEmoji = savedZombieEmoji || zombieEmoji;
    }

    function updateEmoji(type, value) {
        if (type === "skull") {
            document.querySelectorAll(`.cell[data-value='${skullEmoji}']`).forEach(cell => {
                cell.dataset.value = value
                if (cell.classList.contains("flipped")) {
                    cell.textContent = value;
                }
            });
            document.getElementById("flip-skull-button").innerHTML = `Flip <span class="button-icon">${value}</span>`;
            document.getElementById("death-modal-text").textContent = `${value} You Have Died ${value}`;
            skullEmoji = value;
        } 
        else if (type === "apple") {
            document.querySelectorAll(`.cell[data-value='${appleEmoji}']`).forEach(cell => {
                cell.dataset.value = value
                if (cell.classList.contains("flipped")) {
                    cell.textContent = value;
                }
            });
            document.getElementById("flip-apple-button").innerHTML = `Flip <span class="button-icon">${value}</span>`;
            appleEmoji = value;
        } 
        else if (type === "zombie") {
            document.querySelector("h1").innerHTML = value + " Dread Flip - An Online Tool for Dread " + value;
        }
    }

    function loadGameState() {
        loadSettingsFromCookies();
        const gameState = JSON.parse(localStorage.getItem("gameState"));
        //console.log(gameState);
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

    function flipRandomSkull() {
        const cells = Array.from(document.querySelectorAll(".cell"));
        const skullCells = cells.filter(cell => cell.dataset.value === skullEmoji && !cell.classList.contains("flipped"));

        stopTimer();
        if (skullCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * skullCells.length);
            flipCell(skullCells[randomIndex]);
        } 
        else {
            alert("No unflipped skulls available!");
        }
    }

    function flipRandomApple() {
        const cells = Array.from(document.querySelectorAll(".cell"));
        const appleCells = cells.filter(cell => cell.dataset.value === appleEmoji && !cell.classList.contains("flipped"));

        stopTimer();
        if (appleCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * appleCells.length);
            flipCell(appleCells[randomIndex]);
        } 
        else {
            alert("No unflipped apples available!");
        }
    }

    function generateRandomSeed() {
        return Math.floor(Math.random() * 1000000);
    }

    function LCG(seed) {
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        let state = seed;
        return function() {
            state = (a * state + c) % m;
            return state / m;
        };
    }

    function getColumnLetter(index) {
        return String.fromCharCode(65 + index);
    }

    function flipCell(cell) {
        
        if (!cell.classList.contains('flipped')) {
            stopTimer();
            cell.classList.add('shake');
            setTimeout(() => {
                cell.classList.remove('shake');
                cell.classList.add('flipped');
                cell.textContent = cell.dataset.value;
                setTimeout(() => {
                    if (cell.dataset.value === skullEmoji) {
                        showModal();
                    }
                    saveGameState();
                }, 600);
            }, 300);
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
                alert("Time is up!");
                timeRemaining = timeLeft;
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

    function updateSums(gridSize, cellValues, rowSumsContainer, columnSumsContainer) {
        let rowSums = new Array(gridSize).fill(0);
        let columnSums = new Array(gridSize).fill(0);
    
        for (let i = 0; i < cellValues.length; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            if (cellValues[i] === skullEmoji) {
                rowSums[row]++;
                columnSums[col]++;
            }
        }
    
        rowSumsContainer.innerHTML = '';
        columnSumsContainer.innerHTML = '';

        for (let i = 0; i < gridSize; i++) {
            const rowSumElement = document.createElement("div");
            rowSumElement.classList.add("sum");
            rowSumElement.classList.add("hide");
            rowSumElement.textContent = rowSums[i];
            rowSumsContainer.appendChild(rowSumElement);
    
            const colSumElement = document.createElement("div");
            colSumElement.classList.add("sum");
            colSumElement.classList.add("hide");
            colSumElement.textContent = columnSums[i];
            columnSumsContainer.appendChild(colSumElement);
        }
    }

    function validateEmojiSelection(type, emoji) {
        if (type === "skull" && emoji === appleEmojiPicker.value) {
            alert("The death emoji cannot be the same as the life emoji.");
            return false;
        }
        if (type === "apple" && emoji === skullEmojiPicker.value) {
            alert("The life emoji cannot be the same as the death emoji.");
            return false;
        }
        return true;
    }

    function initializeGrid() {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;
        if (seed === null) {
            seed = generateRandomSeed();
        }

        const cellValues = new Array(gridSize * gridSize).fill(appleEmoji);

        let seedValue = (parseInt(seed) * 100) + numSkulls;
        let randomFunction = LCG(seedValue);

        const isRowFree = randomFunction() > 0.5;
        const freeIndex = Math.floor(randomFunction() * gridSize); 

        let placedSkulls = 0;
        while (placedSkulls < numSkulls) {
            const randomIndex = Math.floor(randomFunction() * gridSize * gridSize);
            const row = Math.floor(randomIndex / gridSize);
            const col = randomIndex % gridSize;
            
            // Skip the free row or column
            if ((isRowFree && row === freeIndex) || (!isRowFree && col === freeIndex)) {
                continue;
            }
    
            if (cellValues[randomIndex] !== skullEmoji) {
                cellValues[randomIndex] = skullEmoji;
                //console.log(skullEmoji);
                placedSkulls++;
            }
            if(placedSkulls >= gridSize * gridSize) break;
        }

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.value = cellValues[i];
            cell.addEventListener("click", () => flipCell(cell));
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            cell.textContent = `${getColumnLetter(col)}${row + 1}`;
            grid.appendChild(cell);
        }

        updateSums(gridSize, cellValues, rowSumsContainer, columnSumsContainer);
        stopTimerButton.disabled = true;
        stopTimer();
        hideSums();
    }

    function resetColors(){
        document.body.style.backgroundColor = defaultSettings.backgroundColor;
        document.querySelector("h1").style.color = defaultSettings.headerTextColor;
        document.querySelector(".info-panel").style.backgroundColor = defaultSettings.infoPanelColor;
        document.querySelector(".info-panel").style.color = defaultSettings.infoPanelTextColor;
        document.documentElement.style.setProperty('--grid-unflipped-color', defaultSettings.gridUnflippedColor);
        document.documentElement.style.setProperty('--grid-flipped-color', defaultSettings.gridFlippedColor);
        document.documentElement.style.setProperty('--grid-text-color', defaultSettings.gridTextColor);
        document.documentElement.style.setProperty('--grid-header-color', defaultSettings.gridHeaderColor);
        document.documentElement.style.setProperty('--grid-header-text-color', defaultSettings.gridHeaderTextColor);

        // Reset emojis
        updateEmoji("skull", defaultSettings.skullEmoji);
        updateEmoji("apple", defaultSettings.appleEmoji);
        updateEmoji("zombie", defaultSettings.zombieEmoji);

        // Reset pickers to default values
        backgroundColorPicker.value = defaultSettings.backgroundColor;
        headerTextColorPicker.value = defaultSettings.headerTextColor;
        infoPanelColorPicker.value = defaultSettings.infoPanelColor;
        infoPanelTextColorPicker.value = defaultSettings.infoPanelTextColor;
        gridUnflippedColorPicker.value = defaultSettings.gridUnflippedColor;
        gridFlippedColorPicker.value = defaultSettings.gridFlippedColor;
        gridTextColorPicker.value = defaultSettings.gridTextColor;
        gridHeaderColorPicker.value = defaultSettings.gridHeaderColor;
        gridHeaderTextColorPicker.value = defaultSettings.gridHeaderTextColor;
        skullEmojiPicker.value = defaultSettings.skullEmoji;
        appleEmojiPicker.value = defaultSettings.appleEmoji;
        zombieEmojiPicker.value = defaultSettings.zombieEmoji;
    }

    window.onclick = function(event) {
        if (event.target == deathModal) {
            deathModal.style.display = "none";
            stopTimer();
        }
        if(event.target == settingsModal){
            settingsModal.style.display = "none";
            stopTimer();
        }
        if (event.target == resetModal) {
            resetModal.style.display = "none";
            stopTimer();
        }
    };

    closeModal.onclick = function() {
        deathModal.style.display = "none";
        stopTimer();
    };

    settingsButton.addEventListener("click", () => {
        settingsModal.style.display = "block";
        timerLengthInput.value = timeLeft;
        boardSizeInput.value = gridSize;
        numSkullsInput.value = numSkulls;
        seedInput.value = seed !== null ? seed : generateRandomSeed();
        stopTimer();
    });

    closeSettingsModal.onclick = function() {
        settingsModal.style.display = "none";
    };
    
    saveSettingsButton.addEventListener("click", () => {
        const timerLength = parseInt(timerLengthInput.value);
        const boardSize = parseInt(boardSizeInput.value);
        const skullnum = parseInt(numSkullsInput.value);
        const seedValue = seedInput.value.trim();

        timeLeft = timerLength;

        if(boardSize != gridSize){
            gridSize = boardSize;
            initializeGrid();
        }
        if(numSkulls != skullnum){
            numSkulls = skullnum;
            initializeGrid();
        }
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
        deleteCookie("numSkulls");
        deleteCookie("seed");
        deleteCookie("backgroundColor");
        deleteCookie("headerTextColor");
        deleteCookie("infoPanelColor");
        deleteCookie("infoPanelTextColor");
        deleteCookie("gridUnflippedColor");
        deleteCookie("gridFlippedColor");
        deleteCookie("gridTextColor");
        deleteCookie("gridHeaderColor");
        deleteCookie("gridHeaderTextColor");
        deleteCookie("skullEmoji");
        deleteCookie("appleEmoji");
        deleteCookie("zombieEmoji");
        resetColors();
        localStorage.clear();
        initializeGrid();
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

    backgroundColorPicker.addEventListener("input", (event) => {
        document.body.style.backgroundColor = event.target.value;
        setCookie("backgroundColor", event.target.value, 365);
    });

    headerTextColorPicker.addEventListener("input", (event) => {
        document.querySelector("h1").style.color = event.target.value;
        setCookie("headerTextColor", event.target.value, 365);
    });

    infoPanelColorPicker.addEventListener("input", (event) => {
        document.querySelector(".info-panel").style.backgroundColor = event.target.value;
        setCookie("infoPanelColor", event.target.value, 365);
    });

    infoPanelTextColorPicker.addEventListener("input", (event) => {
        document.querySelector(".info-panel").style.color = event.target.value;
        setCookie("infoPanelTextColor", event.target.value, 365);
    });

    gridUnflippedColorPicker.addEventListener("input", (event) => {
        document.documentElement.style.setProperty('--grid-unflipped-color', event.target.value);
        setCookie("gridUnflippedColor", event.target.value, 365);
    });

    gridFlippedColorPicker.addEventListener("input", (event) => {
        document.documentElement.style.setProperty('--grid-flipped-color', event.target.value);
        setCookie("gridFlippedColor", event.target.value, 365);
    });

    gridTextColorPicker.addEventListener("input", (event) => {
        document.documentElement.style.setProperty('--grid-text-color', event.target.value);
        setCookie("gridTextColor", event.target.value, 365);
    });

    gridHeaderColorPicker.addEventListener("input", (event) => {
        document.documentElement.style.setProperty('--grid-header-color', event.target.value);
        setCookie("gridHeaderColor", event.target.value, 365);
    });

    gridHeaderTextColorPicker.addEventListener("input", (event) => {
        document.documentElement.style.setProperty('--grid-header-text-color', event.target.value);
        setCookie("gridHeaderTextColor", event.target.value, 365);
    });

    document.getElementById("skull-emoji-picker-element").addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;
        if (validateEmojiSelection("skull", emoji)) {
            skullEmojiPicker.value = emoji;
            updateEmoji("skull", emoji);
            setCookie("skullEmoji", emoji, 365);
            saveGameState();
        }
    });

    document.getElementById("apple-emoji-picker-element").addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;
        if (validateEmojiSelection("apple", emoji)) {
            appleEmojiPicker.value = emoji;
            updateEmoji("apple", emoji);
            setCookie("appleEmoji", emoji, 365);
            saveGameState();
        }
    });

    document.getElementById("zombie-emoji-picker-element").addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;
        zombieEmojiPicker.value = emoji;
        updateEmoji("zombie", emoji);
        setCookie("zombieEmoji", emoji, 365);
        saveGameState();
    });

    customizeButton.addEventListener("click", () => {
        body.classList.toggle("customize-sidebar-open");
        customizeButton.classList.add("hidden");
    });

    closeCustomizeButton.addEventListener("click", () => {
        body.classList.remove("customize-sidebar-open");
        customizeButton.classList.remove("hidden");
        setTimeout(() => appleEmojiPickerElement.classList.remove('expanded'), 200);
        setTimeout(() => skullEmojiPickerElement.classList.remove('expanded'), 200);
        setTimeout(() => zombieEmojiPickerElement.classList.remove('expanded'), 200);
    });

    resetCustomizationsButton.addEventListener("click", () => {
        resetColors();

        setCookie("backgroundColor", defaultSettings.backgroundColor, 365);
        setCookie("headerTextColor", defaultSettings.headerTextColor, 365);
        setCookie("infoPanelColor", defaultSettings.infoPanelColor, 365);
        setCookie("infoPanelTextColor", defaultSettings.infoPanelTextColor, 365);
        setCookie("gridUnflippedColor", defaultSettings.gridUnflippedColor, 365);
        setCookie("gridFlippedColor", defaultSettings.gridFlippedColor, 365);
        setCookie("gridTextColor", defaultSettings.gridTextColor, 365);
        setCookie("gridHeaderColor", defaultSettings.gridHeaderColor, 365);
        setCookie("gridHeaderTextColor", defaultSettings.gridHeaderTextColor, 365);
        setCookie("skullEmoji", defaultSettings.skullEmoji, 365);
        setCookie("appleEmoji", defaultSettings.appleEmoji, 365);
        setCookie("zombieEmoji", defaultSettings.zombieEmoji, 365);

        body.classList.remove("customize-sidebar-open");
        customizeButton.classList.remove("hidden");

        saveGameState();
    });

    skullEmojiPicker.addEventListener("focus", () => {
        skullEmojiPickerElement.classList.add('expanded');
    });

    appleEmojiPicker.addEventListener("focus", () => {
        appleEmojiPickerElement.classList.add('expanded');
    });

    zombieEmojiPicker.addEventListener("focus", () => {
        zombieEmojiPickerElement.classList.add('expanded');
    });

    flipSkullButton.addEventListener("click", flipRandomSkull);
    flipAppleButton.addEventListener("click", flipRandomApple);
    startTimerButton.addEventListener("click", startTimer);
    stopTimerButton.addEventListener("click", stopTimer);

    body.classList.remove("customize-sidebar-open");

    kofiButton.addEventListener("click", () => {
        window.open("https://ko-fi.com/hilovids/donate", "_blank");
    });

    if (!loadGameState()) {
        initializeGrid();
    }
});