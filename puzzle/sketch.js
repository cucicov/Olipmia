

//TODO: organize variables
let fps = 0;
let persistentErrors = 0;
let historyErrors = 0;
let touchTargets = [];

let puz = {
    propertiesIdentifier: "puz",
    placeholders: [],
    cards: [],

    selectedCard: undefined,

    PUZZLE_PIECE_SIZE: 230,
    PUZZLE_AREA_TOP_OFFSET: 1200,

    // card sizes
    CARD_WIDTH: undefined,
    CARD_HEIGHT: undefined,

    // position for the initial placeholders starting the game
    POSY_INITIAL_CARD: undefined,
    POSX_INITIAL_CARD: undefined,
    // position for the initial puzzle deck
    POSX_INITIAL_PUZZLE: undefined,
    POSY_INITIAL_PUZZLE: undefined,

    // position for the deck, how far to enter the canvas.
    POSY_INITIAL_DECK: undefined,

    // this controls the limits within which cards can move on posX
    EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -900,
    EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 900,

    // this controls the limits within which cards can move on posY
    POSY_OFFSET_DISPERSE_LEFT_LIMIT: -40,
    POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 40,

    gameState: {
        // id of the current puzzle image.
        puzzleImageId: 1,
        isGameOver: false,
    },

    finalPuzzleImage: {
        img: undefined, // final whole image after the puzzle is solved.
        opacity: 0,
    },

}

let testImg;

function preload() {
    puz.finalPuzzleImage.img = loadImage('img/puzzles/' + puz.gameState.puzzleImageId + '/image.jpg');
}

// additional game prop initializations
function initializeGameProp() {
    createCanvas(2160, 3840);
    puz.CARD_WIDTH = puz.PUZZLE_PIECE_SIZE;
    puz.CARD_HEIGHT = puz.PUZZLE_PIECE_SIZE;

    puz.POSX_INITIAL_CARD = width/2;
    puz.POSY_INITIAL_CARD = 1300;
    puz.POSY_INITIAL_DECK = 1300;

    puz.POSX_INITIAL_PUZZLE = width/2;
    puz.POSY_INITIAL_PUZZLE = height/2 + 400;
}

function setup() {
    initializeGameProp();
    initializePuzzle();
}

function draw() {
    drawPuzzle();
}

function drawPlaceholders() {
    let counterMatches = 0;
    for (let i = 0; i < puz.placeholders.length; i++) {
        let currentPlaceholder = puz.placeholders[i];
        currentPlaceholder.draw();

        // check how many cards match.
        if (currentPlaceholder.activeCard !== undefined
            && currentPlaceholder.activeCard.id === currentPlaceholder.correctCardId) {
            counterMatches++;
        }
    }

    if (counterMatches === puz.cards.length) {
        puz.gameState.isGameOver = true;
    }
}

function drawCards() {

    let winCard = undefined;
    // initialize and display the cards.
    for (let i = 0; i < puz.cards.length; i++) {
        let currentCard = puz.cards[i];

        if (!currentCard.dispersed) {
            currentCard.disperse();
        } else if (currentCard.shouldBeReturned) {
            currentCard.returnToScatteredPosition();
        } else {
            currentCard.draw();
        }
    }
}

function checkEndOfTheGame() {
    if (puz.gameState.isGameOver) {

        // start fading in the final image
        if (puz.finalPuzzleImage.opacity < 1) {
            puz.finalPuzzleImage.opacity += 0.01;
        }
        tint(255, map(puz.finalPuzzleImage.opacity, 0, 1, 0, 255));
        image(puz.finalPuzzleImage.img, this.width/2 - puz.PUZZLE_PIECE_SIZE * 2,
            puz.PUZZLE_AREA_TOP_OFFSET - puz.PUZZLE_PIECE_SIZE/2);
        tint(255, 255);

        // when final image has finished fading in, remove all puzzle pieces.
        if (puz.finalPuzzleImage.opacity > 1 && puz.cards.length > 0) {
            puz.cards = [];
            puz.placeholders = [];
        }
    }

}

function drawPuzzle() {
    background(220);

    // guiding lines center of the screen.
    stroke(1);
    strokeWeight(2);
    line(0, 840, width, 840);
    line(0, height-840, width, height-840);

    drawPlaceholders();
    drawCards();

    // support for touch and desktop.
    if (touches.length == 0) {
        touchTargets[0].x=mouseX;
        touchTargets[0].y=mouseY;
    } else {
        touchTargets[0].x=touches[0].x;
        touchTargets[0].y=touches[0].y;
    }

    // check correct placements.
    checkPuzzlePlaceholderCards();

    // check is end of the game and perform cleanup and final display.
    checkEndOfTheGame();
}

function initializePuzzle() {

    // initialize placeholders.
    puz.placeholders.push(new Placeholder(1,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        1));
    puz.placeholders.push(new Placeholder(2,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        2));
    puz.placeholders.push(new Placeholder(3,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        3));
    puz.placeholders.push(new Placeholder(4,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        4));

    puz.placeholders.push(new Placeholder(5,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        5));
    puz.placeholders.push(new Placeholder(6,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        6));
    puz.placeholders.push(new Placeholder(7,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        7));
    puz.placeholders.push(new Placeholder(8,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        8));

    puz.placeholders.push(new Placeholder(9,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        9));
    puz.placeholders.push(new Placeholder(10,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2 - puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        10));
    puz.placeholders.push(new Placeholder(11,
        this.width/2 + puz.PUZZLE_PIECE_SIZE/2,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        11));
    puz.placeholders.push(new Placeholder(12,
        this.width/2  + puz.PUZZLE_PIECE_SIZE/2 + puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_AREA_TOP_OFFSET + puz.PUZZLE_PIECE_SIZE * 2,
        puz.PUZZLE_PIECE_SIZE,
        puz.PUZZLE_PIECE_SIZE,
        12));

    // initialize cards.
    puz.POSX_INITIAL_CARD = width/2;
    puz.POSY_INITIAL_CARD = 1300;
    puz.POSY_INITIAL_DECK = 1300;

    puz.cards.push(initPuzzleCard(1, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(2, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(3, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(4, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(5, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(6, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(7, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(8, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    puz.cards.push(initPuzzleCard(9, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(10, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(11, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));
    puz.cards.push(initPuzzleCard(12, puz.POSX_INITIAL_PUZZLE, puz.POSY_INITIAL_PUZZLE,
        random(-1, 1), random(-1, 1), puz));

    // init touch targets
    touchTargets.push(new TouchTarget());
}

function initPuzzleCard(id, posx, posy, disperseX, disperseY, gameProp) {
    let card = new Puzzle(id, posx, posy, disperseX, disperseY, gameProp);
    card.enableRotation = false;
    card.shouldScaleWhenActive = false;
    return card;
}



function checkPuzzlePlaceholderCards() {
    // reset cards active placeholders and set them later together with the placeholder settings.
    for (let i = 0; i < puz.cards.length; i++) {
        puz.cards[i].activePlaceholder = undefined;
    }

    for (let i = 0; i < puz.placeholders.length; i++) {
        let currentPlaceholder = puz.placeholders[i];
        currentPlaceholder.activeCard = undefined;
        // currentPlaceholder.draw();

        // check if card should be snapped into placeholder.
        for (let i = 0; i < puz.cards.length; i++) {
            let currentCard = puz.cards[i];
            if (currentPlaceholder.isCardOver(currentCard) && currentPlaceholder.activeCard === undefined
                    && !isAnySelectedCard() && currentCard.id === currentPlaceholder.correctCardId) {
                // set active card and placeholder to each other.
                currentPlaceholder.activeCard = currentCard;
                currentCard.activePlaceholder = currentPlaceholder;
            }
        }
    }
}


// TODO: adapt these in the main project. (((((((((((


function mousePressed() {
    touchStarted();
}

function mouseDragged() {
    touchMoved();
}

function touchStarted() {
    // decide order of the cards based on mouseposition ------
    if (!isAnySelectedCard()) {
        for (let i = 0; i < puz.cards.length; i++) {
            let activeCard = puz.cards[i];
            if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                puz.cards.splice(i, 1);
                puz.cards.push(activeCard);
                puz.selectedCard = activeCard;
                // straighten the selected card
                puz.selectedCard.resetRotation(true);
                // break;
            }
        }

        // clear active pop-up if any.
        // initHidePopUp(tl);
    }

    // checkInfoPopUpClosed(tl);

}

function touchMoved(){
    touchStarted();
    if (isAnySelectedCard()) {
        puz.selectedCard.posx = touchTargets[0].x;
        puz.selectedCard.posy = touchTargets[0].y;
    }
}

function isAnySelectedCard() {
    return puz.selectedCard !== undefined;
}

function clearSelectedCard() {
    puz.selectedCard = undefined;
}

function touchEnded() {
    // for (let i = 0; i < tl.cards.length; i++) {
    //     tl.cards[i].resetRotation(false);
    // }
    clearSelectedCard();
}

// TODO: ))))))))))))))))))))))))