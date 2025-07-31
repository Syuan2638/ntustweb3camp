document.addEventListener('DOMContentLoaded', () => {
    // --- 獲取所有元素 ---
    const envelopePage = document.getElementById('envelope-page');
    const letterPage = document.getElementById('letter-page');
    const gameContainer = document.getElementById('game-container');
    const endingPage = document.getElementById('ending-page');
    const quizPage = document.getElementById('quiz-page');
    const continueToGameButton = document.getElementById('continue-to-game-button');
    const finalPuzzle = document.getElementById('final-puzzle');
    const magicInput = document.getElementById('magic-input');
    const gameBoardElement = document.getElementById('game-board');
    const minesCountElement = document.getElementById('mines-count');
    const resetButton = document.getElementById('reset-button');
    const showQuizButton = document.getElementById('show-quiz-button');
    const hintContainerElement = document.getElementById('hint-container');
    const toolPopup = document.getElementById('tool-popup');
    const toolShovel = document.getElementById('tool-shovel');
    const toolFlag = document.getElementById('tool-flag');
    const quizContainer = document.querySelector('#quiz-page .quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz-button');

    // --- 開場動畫事件 ---
    envelopePage.addEventListener('click', () => {
        envelopePage.classList.add('hidden');
        letterPage.classList.remove('hidden');
        setTimeout(() => { continueToGameButton.classList.remove('hidden'); }, 10000);
    });
    continueToGameButton.addEventListener('click', () => {
        letterPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    });

    // --- 遊戲設定 ---
    const BOARD_WIDTH = 15, BOARD_HEIGHT = 5;
    const MINE_LOCATIONS = [
        { r: 0, c: 0 }, { r: 4, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 },
        { r: 0, c: 2 }, { r: 4, c: 2 }, { r: 1, c: 3 }, { r: 0, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 5 }, { r: 1, c: 6 },
        { r: 4, c: 6 }, { r: 3, c: 7 }, { r: 0, c: 8 }, { r: 2, c: 8 }, { r: 1, c: 9 }, { r: 0, c: 10 }, { r: 1, c: 11 },
        { r: 2, c: 12 }, { r: 3, c: 12 }, { r: 4, c: 12 }, { r: 1, c: 13 }, { r: 0, c: 14 }
    ];
    const MINE_COUNT = MINE_LOCATIONS.length;
    const PRESET_INITIAL_CELLS = [
        { r: 2, c: 0 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 4 },
        { r: 4, c: 4 }, { r: 0, c: 6 }, { r: 4, c: 7 }, { r: 4, c: 9 }, { r: 1, c: 10 },
        { r: 3, c: 10 }, { r: 4, c: 10 }, { r: 3, c: 11 }, { r: 3, c: 13 }, { r: 1, c: 14 },
        { r: 3, c: 14 }, { r: 4, c: 14 }
    ];
    const quizQuestions = [
        { question: "一個新創團隊正在設計一個「去中心化投票系統」。他們希望這個系統能確保每張票都真實有效，不被篡改（安全性高），並且沒有任何單一機構能控制投票結果或阻止投票（去中心化強）。然而，他們也意識到，如果讓全球數十億人同時投票，系統可能會非常緩慢甚至崩潰（擴展性挑戰）。根據這樣的設計困境，這個團隊最可能面临的考驗是什麼？", options: ["A. 如何在極高的效率和成本效益之間取得平衡", "B. 如何確保數據在透明度和隱私之間取得最佳平衡", "C. 如何在系統的穩定性與用戶的易用性之間做出取捨", "D. 如何在極致的去中心化與處理大規模數據的效率之間找到平衡點"], answer: "D" },
        { question: "一家大型跨國公司想用區塊鏈來追蹤其全球供應鏈上的高價值鑽石，從礦場到最終消費者的每一個環節。他們需要確保數據不可否改、可追溯，但同時，這些內部商業數據不能對公眾完全公開，且參與者必須是經過審核的合作夥伴。依據這些需求，哪種類型的數位帳本系統最適合這家公司的需求？", options: ["A. 完全開放，人人可讀寫的全球性公開帳本", "B. 由單一公司獨自控制，數據不對外開放的私有帳本", "C. 由多個互信的聯盟成員共同維護，具備權限控制的共享帳本", "D. 依賴中央伺服器進行數據管理，但具有高度加密的傳統數據庫"], answer: "C" },
        { question: "在數位世界的早期探索中，曾出現一種劃時代的「數位信用證明」，它被設計成數量固定、不被任何中央權威控制，主要功能是讓兩個人可以直接進行價值轉移，無需透過第三方金融機構。這種「數位信用證明」的出現，為後來的各種複雜應用奠定了基礎。這種數位創新，最符合我們課程中提到的哪個發展階段？", options: ["A. 承載複雜應用和智能自動化的時代", "B. 專注於實現點對點價值傳輸的初期階段", "C. 追求超高速度和多系統互通的最新階段", "D. 仍依賴單一中央實體進行數據管理的階段"], answer: "B" },
        { question: "你是一名線上遊戲玩家，最近發現遊戲內的虛擬寶物交易，雖然很安全但每筆交易的「手續費」都非常高，而且交易確認時間很慢，大大影響了遊戲體驗。後來，遊戲開發商推出了一項新的「輔助通道」技術，讓你在不離開遊戲生態的前提下，進行遊戲內交易變得幾乎零成本、秒速完成。根據課程內容，這項「輔助通道」技術最類似於哪種解決方案？", options: ["A. 提升遊戲伺服器性能的中心化升級", "B. 在獨立的、高速的輔助數位網絡上進行操作", "C. 將遊戲交易轉移到完全不同的獨立遊戲平台", "D. 讓遊戲資產可以在任意平台上自由交換的技術"], answer: "B" },
        { question: "小花剛在一個「測試版」的數位交易系統中進行了一筆小額轉帳。她知道這筆轉帳不會動用到真實的錢。當她查看這筆交易的狀態時，發現有一個長長的、由數字和字母組成的代碼，可以讓她在公開的網站上查詢這筆交易的詳細過程。這串代碼最可能代表的是什麼？", options: ["A. 她的用戶名和密碼加密組合", "B. 這筆轉帳的目的地帳戶編號", "C. 這筆交易在系統中的獨一無二的數位指紋", "D. 她這次操作所消耗的數位能量費用"], answer: "C" },
        { question: "一個大型製藥公司需要與其遍佈全球的供應商、經銷商和醫院建立一個安全、可追溯的數據共享網絡。這些數據包含藥品批次、生產日期、運輸溫度等敏感信息。他們需要確保數據的真實性，且只有授權的合作夥伴才能訪問和驗證。如果需要更新系統規則，也需要這些合作夥伴共同協商決定。這種數據網絡最符合課程中介紹的哪種『數位帳本』の特性？", options: ["A. 高度開放且全民參與的數位帳本", "B. 由少數預選機構共同控制且具權限管理能力的共享帳本", "C. 由單一權威實體完全掌控的私人數位帳本", "D. 依賴複雜人工審核流程的傳統記錄系統"], answer: "B" },
        { question: "你手上有一個在「平台 A」上獲得的稀有數位收藏品，你想在「平台 B」上的遊戲中使用它。但這兩個平台使用的是完全不同的底層技術，無法直接轉移。你透過一個特殊的「數位轉換服務」，將你的收藏品在平台 A 上「暫時保管」起來，然後在平台 B 上獲得了一個「等值且可使用」的收藏品版本。當你想用回平台 A 時，平台 B 的版本會「消失」，平台 A 的原始收藏品就會「恢復」。這個過程最符合課程中介紹的哪種技術原理？", options: ["A. 點對點的直接數字資產交換", "B. 依賴中心化機構進行資產轉換", "C. 將資產在一個系統鎖定，在另一個系統生成等效版本", "D. 透過共享數據庫同步兩個平台上的所有信息"], answer: "C" },
        { question: "某家新創公司開發了一款號稱能「連接所有數位平台」的「通用數字資產轉換器」。這個轉換器承諾超高速度和極低費用。但媒體報導指出，該轉換器的大部分數字資產都集中存放在一個由該公司獨立控制的巨大數字保險庫中，其安全性完全依賴於該公司的單一技術團隊。作為用戶，在使用這個轉換器時，你最應該擔憂的主要風險是什麼？", options: ["A. 數字資產轉換後的價值不穩定性", "B. 轉換器可能無法支援所有的數字平台", "C. 駭客攻擊該數字保險庫可能導致大量資產損失", "D. 轉換服務可能因為交易量過大而速度變慢"], answer: "C" },
        { question: "小華在嘗試發送測試幣時，錢包彈出一個提示，顯示需要支付一筆「燃料費」。他回想起課程中曾提到，這是為了支付網路運行的成本。請問，在以太坊生態系中，這種「燃料費」通常是用什麼來支付的？", options: ["A. 比特幣 (Bitcoin)", "B. 萊特幣 (Litecoin)", "C. 以太幣 (Ether - ETH)", "D. MATIC (Polygon 的代幣)"], answer: "C" },
        { question: "小陳是一位 Web3 創業家，他正思考要開發一個全新的去中心化應用。他了解到數位技術有不同的「世代」演進。如果他希望他的應用能夠處理每秒數万筆的交易，且手續費極低，以滿足大規模用戶的使用需求，他最應該優先考慮的數位基礎架構屬於哪個世代？", options: ["A. 主要處理點對點價值轉移的初期基礎架構", "B. 能夠運行複雜自動化程序但擴展性受限的基礎架構", "C. 致力於解決大規模應用挑戰、追求高效互聯的下一代基礎架構", "D. 依賴單一中央實體進行全球數據管理的傳統架構"], answer: "C" },
    ];
    let selectedQuestionsForQuiz = [];
    
    let board = [], flags = 0, gameOver = false;
    let hintProgress = 0, hintPathElements = [];
    let hasAttemptedQuiz = false;
    let activeCellForPopup = null;
    let usePaperForNextThree = true;
    let mineHitCount = 0;

    toolShovel.addEventListener('click', () => {
        if (activeCellForPopup) {
            const { r, c } = activeCellForPopup;
            const cellData = board[r][c];
            if (cellData.isFlagged || cellData.isRevealed) { closeToolPopup(); return; }

            if (cellData.isMine) {
                mineHitCount++;
                cellData.element.classList.add('explosion-shake');
                setTimeout(() => {
                    cellData.element.classList.remove('explosion-shake');
                    if (mineHitCount >= 3) {
                        showQuizButton.classList.remove('hidden');
                        gameBoardElement.classList.add('locked');
                        alert('你踩到太多地雷了！需要回答問題才能繼續。');
                    } else {
                        alert(`你踩到了一個地雷！還有 ${3 - mineHitCount} 次機會。`);
                    }
                }, 800);
            } else { 
                revealCell(r, c);
            }
            closeToolPopup();
        }
    });
    toolFlag.addEventListener('click', () => {
        if (activeCellForPopup) {
            const { r, c } = activeCellForPopup;
            toggleFlag(r, c);
            closeToolPopup();
        }
    });
    window.addEventListener('click', (event) => {
        if (!toolPopup.classList.contains('hidden') && !toolPopup.contains(event.target) && !event.target.classList.contains('cell')) {
            closeToolPopup();
        }
    });
    magicInput.addEventListener('input', (event) => {
        const rawInput = event.target.value;
        const cleanedInput = rawInput.toUpperCase().replace(/\s/g, '');
        if (cleanedInput === 'ILOVEYOU') {
            magicInput.disabled = true;
            setTimeout(() => {
                gameContainer.classList.add('hidden');
                endingPage.classList.remove('hidden');
            }, 500);
        }
    });
    showQuizButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        generateQuiz();
        quizPage.classList.remove('hidden');
    });
    submitQuizButton.addEventListener('click', () => {
        checkQuizAnswers();
    });

    function resetBoard() {
        gameOver = false;
        flags = 0;
        hintPathElements.forEach(el => el.classList.remove('hint-step-active'));
        hintPathElements = [];
        closeToolPopup();
        board = [];
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, 24px)`;
        minesCountElement.textContent = MINE_COUNT;
        
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            const row = [];
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cell = { isMine: false, isRevealed: false, isFlagged: false, element: null, adjacentMines: 0 };
                row.push(cell);
            }
            board.push(row);
        }
        MINE_LOCATIONS.forEach(loc => {
            if (loc.r < BOARD_HEIGHT && loc.c < BOARD_WIDTH) {
                board[loc.r][loc.c].isMine = true;
            }
        });
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                if (!board[r][c].isMine) {
                    board[r][c].adjacentMines = calculateAdjacentMines(r, c);
                }
            }
        }
        createBoardElement();

        PRESET_INITIAL_CELLS.forEach(coord => {
            if (board[coord.r] && board[coord.r][coord.c] && !board[coord.r][coord.c].isMine) {
                revealCell(coord.r, coord.c, true);
            }
        });
    }

    function startGame() {
        finalPuzzle.classList.add('hidden');
        magicInput.value = '';
        magicInput.disabled = false;
        usePaperForNextThree = true;
        hasAttemptedQuiz = false;
        hintProgress = 0;
        mineHitCount = 0;
        hintContainerElement.classList.add('hidden');
        showQuizButton.classList.add('hidden');
        gameBoardElement.classList.remove('locked');
        resetBoard();
        resetButton.addEventListener('click', () => {
            if (!endingPage.classList.contains('hidden')) {
                endingPage.classList.add('hidden');
                gameContainer.classList.remove('hidden');
            }
            startGame();
        });
    }

    function createBoardElement() {
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.row = r;
                cellElement.dataset.col = c;
                cellElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    handleCellClick(r, c, event);
                });
                board[r][c].element = cellElement;
                gameBoardElement.appendChild(cellElement);
            }
        }
    }
    
    // *** 修正點：移除 isFlagged 判斷，允許點擊已插旗的格子 ***
    function handleCellClick(r, c, event) {
        if (gameOver || board[r][c].isRevealed) {
            closeToolPopup();
            return;
        }
        activeCellForPopup = { r, c };
        const rect = event.target.getBoundingClientRect();
        toolPopup.style.top = `${window.scrollY + rect.bottom + 5}px`;
        toolPopup.style.left = `${window.scrollX + rect.left + rect.width / 2 - toolPopup.offsetWidth / 2}px`;
        toolPopup.classList.remove('hidden');
    }
    
    // *** 修正點：增加旗子數量限制 ***
    function toggleFlag(r, c) {
        if (gameOver || board[r][c].isRevealed) return;
        const cell = board[r][c];
        const cellElement = cell.element;

        if (cell.isFlagged) {
            // 移除旗子
            const flagImg = cellElement.querySelector('.flag-icon');
            if (flagImg) cellElement.removeChild(flagImg);
            cell.isFlagged = false;
            flags--;
        } else {
            // 增加旗子前的檢查
            if (flags >= 26) {
                alert('最多只能插 26 支旗子！');
                return;
            }
            const flagImg = document.createElement('img');
            flagImg.src = 'images/flag.png';
            flagImg.alt = '旗子';
            flagImg.classList.add('flag-icon');
            cellElement.appendChild(flagImg);
            cell.isFlagged = true;
            flags++;
        }
        minesCountElement.textContent = MINE_COUNT - flags;
        checkWinCondition();
    }

    function closeToolPopup() {
        toolPopup.classList.add('hidden');
        activeCellForPopup = null;
    }

    function revealCell(r, c, isInitial = false) {
        if (r < 0 || r >= BOARD_HEIGHT || c < 0 || c >= BOARD_WIDTH || board[r][c].isRevealed) return;
        const cell = board[r][c];
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        if (cell.isFlagged) toggleFlag(r, c);
        
        const img = document.createElement('img');
        img.classList.add('crypto-icon');
        let hasCustomImage = true;

        if (cell.adjacentMines === 1) {
            img.src = 'images/bitcoin.png'; img.alt = '比特幣';
        } else if (cell.adjacentMines === 2) {
            img.src = 'images/ethereum.png'; img.alt = '以太幣';
        } else if (cell.adjacentMines === 3) {
            if (usePaperForNextThree) {
                img.src = 'images/paper.png';
                img.alt = '信紙';
            } else {
                img.src = 'images/polkadot.png';
                img.alt = '波卡';
            }
            usePaperForNextThree = !usePaperForNextThree;
        } else if (cell.adjacentMines === 4) {
            img.src = 'images/Litecoin.png'; img.alt = '萊特幣';
        } else {
            hasCustomImage = false;
        }

        if (hasCustomImage) {
            cell.element.appendChild(img);
        } else if (cell.adjacentMines >= 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.dataset.mines = cell.adjacentMines;
            if (cell.adjacentMines === 0 && !isInitial) {
                 for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        revealCell(r + dr, c + dc);
                    }
                }
            }
        }
        checkWinCondition();
    }
    
    function calculateAdjacentMines(r, c) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newR = r + dr;
                const newC = c + dc;
                if (newR >= 0 && newR < BOARD_HEIGHT && newC >= 0 && newC < BOARD_WIDTH && board[newR][newC].isMine) {
                    count++;
                }
            }
        }
        return count;
    }
    
    function checkWinCondition() {
        if (gameOver) return;
        let correctlyFlaggedMines = 0;
        let revealedCount = 0;
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cell = board[r][c];
                if (cell.isFlagged && cell.isMine) {
                    correctlyFlaggedMines++;
                }
                if (cell.isRevealed) {
                    revealedCount++;
                }
            }
        }
        const nonMineCells = (BOARD_WIDTH * BOARD_HEIGHT) - MINE_COUNT;
        if (correctlyFlaggedMines === MINE_COUNT || revealedCount === nonMineCells) {
            endGame(true);
        }
    }
    
    function endGame(isWin) {
        gameOver = true;
        closeToolPopup();
        if (isWin) {
            for (let r = 0; r < BOARD_HEIGHT; r++) {
                for (let c = 0; c < BOARD_WIDTH; c++) {
                    const cell = board[r][c];
                    if (!cell.isRevealed) {
                        cell.isRevealed = true;
                        cell.element.classList.add('revealed');
                    }
                    cell.element.innerHTML = '';
                    if (cell.isMine) {
                        const heartImg = document.createElement('img');
                        heartImg.src = 'images/heart.png';
                        heartImg.alt = '愛心';
                        heartImg.classList.add('heart-icon');
                        cell.element.appendChild(heartImg);
                    }
                }
            }
            finalPuzzle.classList.remove('hidden');
        }
    }
    
    function revealHintReward() {
        // This function seems to be part of a different puzzle.
    }

    function generateQuiz() {
        quizContainer.innerHTML = '';
        selectedQuestionsForQuiz = [];
        const shuffledQuestions = [...quizQuestions].sort(() => 0.5 - Math.random());
        selectedQuestionsForQuiz = shuffledQuestions.slice(0, 3);

        selectedQuestionsForQuiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');

            const questionText = document.createElement('p');
            questionText.textContent = `第 ${index + 1} 題: ${q.question}`;
            questionDiv.appendChild(questionText);

            const optionsList = document.createElement('ul');
            optionsList.classList.add('quiz-options');
            
            q.options.forEach((opt, optIndex) => {
                const listItem = document.createElement('li');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `quiz-question-${index}`;
                radioInput.id = `q${index}-opt${optIndex}`;
                radioInput.value = opt.charAt(0);

                const label = document.createElement('label');
                label.htmlFor = radioInput.id;
                label.textContent = opt;
                
                listItem.appendChild(radioInput);
                listItem.appendChild(label);
                optionsList.appendChild(listItem);
            });

            questionDiv.appendChild(optionsList);
            quizContainer.appendChild(questionDiv);
        });
    }

    function checkQuizAnswers() {
        hasAttemptedQuiz = true;
        let correctCount = 0;
        selectedQuestionsForQuiz.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="quiz-question-${index}"]:checked`);
            if (selectedOption && selectedOption.value === q.answer) {
                correctCount++;
            }
        });

        if (correctCount === 3) {
            alert('恭喜你！全部答對了！遊戲版已解鎖。');
            gameBoardElement.classList.remove('locked');
            mineHitCount = 0;
            showQuizButton.classList.add('hidden');
        } else {
            alert(`你答對了 ${correctCount} 題，但需要全部答對才能繼續喔！`);
        }

        quizPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        if (hasAttemptedQuiz) {
            hintContainerElement.classList.remove('hidden');
        }
    }
});
