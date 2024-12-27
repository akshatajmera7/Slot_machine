// 1. deposit some money
// 2. determine number of lines to bet on
// 3. collect a bet amount
// 4. spin the slot machine
// 5. check win
// 6. give user their winnings
// 7. play again

const prompt = require("prompt-sync")();
// this above prompt is used to take user input 

// slot machine local variables
const ROWS = 3;
const COLs = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberoflines = () => {
    while (true) {
        const LinesAmount = prompt("Enter number of lines to bet on (1-3): ");
        const numberLinesAmount = parseFloat(LinesAmount);

        if (isNaN(numberLinesAmount) || numberLinesAmount <= 0 || numberLinesAmount >= 4) {
            console.log("Invalid number of Lines");
        } else {
            return numberLinesAmount;
        }
    }
};

const getBetAmount = (depositAmount, LinesAmount) => {
    while (true) {
        const getBetAmoun = prompt("Enter the amount you want to bet on each line: ");
        const betPerLine = parseFloat(getBetAmoun);
        const totalBet = betPerLine * LinesAmount;

        if (isNaN(totalBet) || betPerLine <= 0) {
            console.log("Please enter a valid amount");
        } else if (totalBet > depositAmount) {
            console.log("The bet amount exceeds balance added");
        } else {
            return totalBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLs; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLs; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i < row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let i = 0; i < lines; i++) {
        const row = rows[i];
        const firstSymbol = row[0];
        let allSame = true;
        for (const symbol of row) {
            if (symbol !== firstSymbol) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += SYMBOLS_VALUES[firstSymbol] * bet;
        }
    }
    return winnings;
}

const game = () => {
    let depositAmount = deposit();
    while (true) {
        console.log("Your balance is " + depositAmount);
        const LinesAmount = getNumberoflines();
        const amount = getBetAmount(depositAmount, LinesAmount);
        depositAmount -= amount;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, amount / LinesAmount, LinesAmount);
        depositAmount += winnings;
        console.log("You won " + winnings);
        console.log("Your balance is " + depositAmount);
        const playAgain = prompt("Enter 'y' to play again: ");
        if (playAgain !== 'y') {
            console.log("Goodbye");
            break;
        }
    }
}

game();
