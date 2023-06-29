//------------------------------------------------------------------------------------------------------------------
// Author: Stéphan Gabriel NANDRASANTSOA
// version: 1.0
// copyright: 26 june 2023 8:55 pm
// nationality: Malagasy
//------------------------------------------------------------------------------------------------------------------
const startGame = (type)=>{
    const WIN_COMBINATION = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const IA = 'o';
    const HUMAN = 'x';
    const LETTRE_ROND = '\u25cb';
    const LETTER_FOIS = '\u26CC';
    const FIRST_PLAYER = 'x'
    let board = ['', '', '', '', '', '', '', '', ''];
    let playerBegin = 0
    let twoPlayer = type;
    let restart = false;
    let level = document.getElementById('level').value;
    let pointP1 = 0;
    let pointP2 = 0;
    let firstPlayerStatus = document.getElementById('activeFirstPlayer').getAttribute("class")
    let secondPlayerStatus
    function initialisation(continuer=true) {
        clearScreen();
        board = ['', '', '', '', '', '', '', '', ''];
        twoPlayer = document.getElementById('twoPlayer').checked;
        pointP1 = document.getElementById("firstPlayerScore").innerText;
        pointP2 = document.getElementById("secondPlayerScore").innerText;
        playerBegin++;
        if (!continuer) {
            playerBegin--;
            turnViewPlayer();
        }
        turnViewPlayer(true);
        if (type != twoPlayer || level != document.getElementById('level').value) {
            type = twoPlayer;
            scoreInit();
            playerBegin = 0;
            turnViewPlayer(true);
        } else {
            if (!twoPlayer && playerBegin % 2 != 0) {
                selectAction(9);
            }
        }
    }

    const clearScreen = ()=>{
        for (let index = 0; index < 9; index++) {
            document.getElementById(index).textContent = '';
            document.getElementById(index).style.color = 'black';
            document.getElementById(index).style.animation = '';
        }
    }

    const scoreInit = ()=>{
        pointP1 = 0;
        pointP2 = 0;
        document.getElementById("firstPlayerScore").innerText = pointP1;
        document.getElementById("secondPlayerScore").innerText = pointP2;
        document.getElementById("winFirstPlayerScore").innerText = pointP1;
        document.getElementById("winSecondPlayerScore").innerText = pointP2;
    }
    const isRestart = ()=>{
        restart = true;
    }

    const turnViewPlayer = (init=false)=>{
        if (init == true) {
            if (playerBegin % 2 == 0) {
                firstPlayerStatus = 'activate'
                secondPlayerStatus = ''
            } else {
                firstPlayerStatus = ''
                secondPlayerStatus = 'activate'
            }
        } else {
            firstPlayerStatus = ''
            secondPlayerStatus = ''
            if (document.getElementById('activeFirstPlayer').getAttribute("class") == null || document.getElementById('activeFirstPlayer').getAttribute("class") == '') {
                firstPlayerStatus = 'activate'
                secondPlayerStatus = ''
            } else {
                firstPlayerStatus = ''
                secondPlayerStatus = 'activate'
            }

        }
        document.getElementById('activeFirstPlayer').setAttribute('class', firstPlayerStatus);
        document.getElementById('activeSecondPlayer').setAttribute('class', secondPlayerStatus);

    }
    const showWinner = (message,win='🏆')=>{
        let delai = 1800
        if (win != '🏆') {
            delai = 500
        }
        setTimeout(()=>{
            document.getElementById('win').innerText = win;
            document.body.setAttribute('class', 'blur');
            document.getElementById('message').textContent = message;
            document.getElementById('modal2').showModal();
        }
        , delai)

    }
    const iaAction = (choiceMove,choiceLetter)=>{
        let content = document.getElementById(choiceMove).textContent;
        if (content === '') {
            setTimeout(()=>{
                document.getElementById(choiceMove).style.animation = "scaleEffect 0.8s";
                document.getElementById(choiceMove).textContent = choiceLetter;

                setTimeout(()=>{
                    document.getElementById(choiceMove).textContent = choiceLetter;
                    document.getElementById(choiceMove).style.animation = '';
                }
                , 150);
            }
            , 200)
            board[choiceMove] = IA;
        }

    }
    const humanAction = (choiceMove,choiceLetter)=>{
        let content = document.getElementById(choiceMove).textContent
        if (content === '') {
            document.getElementById(choiceMove).textContent = choiceLetter;
            document.getElementById(choiceMove).style.animation = "scaleEffect 0.8s";
            setTimeout(()=>{
                document.getElementById(choiceMove).textContent = choiceLetter;
                document.getElementById(choiceMove).style.animation = '';
            }
            , 150);
            board[choiceMove] = (choiceLetter == '\u26CC' ? HUMAN : IA);
            return true;
        }
        return false;
    }

    function isWinner(player, tryal=true) {
        function checkBoard(player, combo) {
            return combo.every((index)=>board[index] === player);
        }
        for (let i = 0; i < WIN_COMBINATION.length; i++) {
            if (checkBoard(player, WIN_COMBINATION[i])) {
                if (tryal == false) {
                    for (let index = 0; index < 3; index++) {
                        document.getElementById(WIN_COMBINATION[i][index]).style.color = "#FFC107";
                        setTimeout(()=>{
                            document.getElementById(WIN_COMBINATION[i][index]).style.animation = "scaleEffect .5s"
                            setTimeout(()=>{
                                document.getElementById(WIN_COMBINATION[i][index]).style.animation = '';
                            }
                            , 500)
                        }
                        , 800)
                    }
                    (player == 'x') ? pointP1++ : pointP2++;
                    document.getElementById("firstPlayerScore").innerText = pointP1;
                    document.getElementById("secondPlayerScore").innerText = pointP2;
                    document.getElementById("winFirstPlayerScore").innerText = pointP1;
                    document.getElementById("winSecondPlayerScore").innerText = pointP2;
                }
                return true;
            }
        }
        return false;
    }

    function canPlay() {
        return board.indexOf('') > -1;
    }

    function getScore() {
        if (isWinner(HUMAN)) {
            return -1;
        } else if (isWinner(IA)) {
            return 1;
        } else {
            if (!canPlay()) {
                return 0;
            }
        }
    }
    function iaChoice() {
        let maxScore = -Infinity;
        let move;
        let tabMove = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] == '') {
                //Test de cette choix
                board[i] = IA;
                let score = minmax(board, false);
                board[i] = '';
                if (score > maxScore) {
                    maxScore = score;
                    move = i;
                }
            }
        }
        return move;
    }
    function minmax(copieBoard, isMaximizing) {
        const winnerScore = getScore();

        if (winnerScore !== undefined) {
            return winnerScore;
        }
        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let index = 0; index < 9; index++) {
            if (copieBoard[index] === '') {
                copieBoard[index] = isMaximizing ? IA : HUMAN;
                // console.log('Copie Board:', copieBoard);
                let score = minmax(copieBoard, !isMaximizing);
                copieBoard[index] = '';

                if (isMaximizing) {
                    bestScore = Math.max(score, bestScore);
                    // console.log(`Max score:${bestScore}`)
                } else {
                    bestScore = Math.min(score, bestScore);
                    // console.log(`Min score:${bestScore}`)
                }
            }
        }
        return bestScore;
    }
    const iaSelection = ()=>{
        if (level == 0) {
            while (true) {
                let choice = Math.floor(Math.random() * 9);
                if (board[choice] == '') {
                    iaAction(choice, LETTRE_ROND);
                    break;
                }
            }
        } else {
            if (level == 50) {
                if ((Math.floor(Math.random() * 20)) % 2 == 0) {
                    while (true) {
                        let choice = Math.floor(Math.random() * 9);
                        if (board[choice] == '') {
                            iaAction(choice, LETTRE_ROND);
                            break;
                        }
                    }
                } else {
                    iaAction(iaChoice(), LETTRE_ROND);
                }

            } else {
                iaAction(iaChoice(), LETTRE_ROND);
            }
        }
    }
    const selectAction = (nb)=>{
        if (nb > 8) {
            iaSelection();
            turnViewPlayer();
        } else {
            if (canPlay() && !isWinner(HUMAN) && !isWinner(IA) && !restart) {
                if (twoPlayer) {
                    let playerTurn = (firstPlayerStatus == 'activate');
                    if (humanAction(nb, playerTurn ? LETTER_FOIS : LETTRE_ROND)) {
                        turnViewPlayer();
                    }
                    if (isWinner((playerTurn ? 'x' : 'o'), false)) {
                        showWinner((playerTurn ? LETTER_FOIS : LETTRE_ROND) + ' WIN 🎯👏');
                    }
                } else {
                    if (humanAction(nb, LETTER_FOIS) && !isWinner(HUMAN) && canPlay()) {
                        iaSelection();
                        turnViewPlayer();
                    }
                    if (isWinner(HUMAN, false) || isWinner(IA, false)) {
                        showWinner((isWinner(HUMAN) ? LETTER_FOIS : LETTRE_ROND) + ' WIN 🎯👏');
                    }
                }
                if (!canPlay() && !isWinner(HUMAN, false) && !isWinner(IA, false)) {
                    showWinner(' Equality', '🙌');
                }
            }
        }

    }

    // INITIALISATION DU TABLE DE JEU
    for (let index = 0; index < 9; index++) {
        let a = document.getElementById(index);
        a.addEventListener('click', ()=>{
            a.style.transition = '2s';
            selectAction(a.getAttribute('id'));
        }
        );
    }
    document.getElementById('fermetureModal1').style.visibility = "";
    document.getElementById('fermetureModal1').addEventListener('click', ()=>document.getElementById('modal1').close())
    return {
        initialisation
    }
}
let gameStart;
document.getElementById('modal1').showModal();
document.body.setAttribute('class', 'blur');
document.getElementById('fermetureModal1').style.visibility = "hidden";
document.getElementById('start').addEventListener('click', function() {
    twoPlayer = document.getElementById('twoPlayer').checked;
    document.body.removeAttribute('class');
    if (gameStart != undefined) {
        gameStart.initialisation();
    }
    gameStart = startGame(twoPlayer);
});
document.getElementById('showMenu').addEventListener('click', function() {
    document.body.setAttribute('class', 'blur');
    document.getElementById('modal1').showModal();
});
for (let index = 1; index < 3; index++) {
    document.getElementById('restart' + index).addEventListener('click', function() {
        gameStart.initialisation((index == 1) ? false : true);
    });
    document.getElementById('modal' + index).addEventListener('close', ()=>document.body.removeAttribute('class'));

}
document.getElementById('modal1').addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
    }
})
document.getElementById('modal2').addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
    }
})

document.getElementById('twoPlayer').addEventListener('click', ()=>document.getElementById('indication').style.visibility = 'hidden');
document.getElementById('onePlayer').addEventListener('click', ()=>document.getElementById('indication').style.visibility = '');