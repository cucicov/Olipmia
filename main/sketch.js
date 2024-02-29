let fps = 0;
let touchTargets = [];
let activeGame;

let SCREEN_WIDTH = 2160;
let SCREEN_HEIGHT = 3840;

let button1;
let button2;
let button3;
let button4;

let tl = {};

let mem = {};

// +++++ PRELOADED content.
let loadedImages = [];
let restartTimelineButtonRo;
let restartTimelineButtonEn;
let fontNotoMedium;
let fontNotoLight;
let fontZebrra;

let timelineBg;

// -------------------------------

function preload() {
    fontNotoMedium = loadFont('font/NotoSans-Medium.ttf');
    fontNotoLight = loadFont('font/NotoSans-Light.ttf');
    fontZebrra = loadFont('font/zebrra.regular.ttf');

    loadedImages.push([loadImage('img/1.jpg'), '1']); // keep a unique ID of the image to keep track of the displayed images and not display them anymore in the current game.
    loadedImages.push([loadImage('img/2.jpg'), '2']);
    loadedImages.push([loadImage('img/3.jpg'), '3']);
    loadedImages.push([loadImage('img/4.jpg'), '4']);
    loadedImages.push([loadImage('img/5.jpg'), '5']);
    loadedImages.push([loadImage('img/6.jpg'), '6']);
    loadedImages.push([loadImage('img/7.jpg'), '7']);
    loadedImages.push([loadImage('img/8.jpg'), '8']);
    loadedImages.push([loadImage('img/9.jpg'), '9']);
    loadedImages.push([loadImage('img/10.jpg'), '10']);
    loadedImages.push([loadImage('img/11.jpg'), '11']);
    loadedImages.push([loadImage('img/12.jpg'), '12']);

    restartTimelineButtonRo = loadImage('timelineImg/restart_ro.png');
    restartTimelineButtonEn = loadImage('timelineImg/restart_ro.png'); //TODO:

    timelineBg = loadImage("timelineImg/timelineBg.png");

    activeGame = "mem";
}

function setup() {
    textFont(fontNotoMedium);

    if (activeGame === "mem"){
        initializeMemory();
    }
    if (activeGame === "tl"){
        initializeTimeline();
    }

    initializeMenuButtons();
}

function draw() {
    if (activeGame === "mem"){
        drawMemory();
    }
    if (activeGame === "tl"){
        drawTimeline();
    }

    drawMenuButtons();
}


// ++++++++++++++++++++++++++ MENU +++++++++++++++++++++++++++++

function initializeMenuButtons() {
    button1 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT/2) - 1200, 50, 50);
    button1.isVisible = true;
    button1.text = "1";
    button2 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT/2) - 1100, 50, 50);
    button2.isVisible = true;
    button2.text = "2";
    button3 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT/2) - 1000, 50, 50);
    button3.isVisible = true;
    button3.text = "3";
    button4 = new Button(SCREEN_WIDTH - 100, (SCREEN_HEIGHT/2) - 900, 50, 50);
    button4.isVisible = true;
    button4.text = "4";
}

function drawMenuButtons() {
    button1.draw();
    button2.draw();
    button3.draw();
    button4.draw();

    // timeline
    if (button1.isClicked(mouseX, mouseY) && !tl.isInitialized) {
        activeGame = "tl";
        setup();

        tl.isInitialized = true;
        mem.isInitialized = false;
    }

    // memory
    if (button2.isClicked(mouseX, mouseY) && !mem.isInitialized) {
        activeGame = "mem";
        setup();

        mem.isInitialized = true;
        tl.isInitialized = false;
    }
}



// ++++++++++++++++++++++++++ TIMELINE +++++++++++++++++++++++++++++
function initializeTimeline() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    tl = {
        propertiesIdentifier: "tl",
        isInitialized: false,
        // this controls the limits of within which cards can move on posX
        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -800,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 800,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -60,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 30,

        // position for the initial card starting the game
        POSY_INITIAL_CARD: undefined,
        POSX_INITIAL_CARD: undefined,

        // position for the deck, how far to enter the canvas.
        POSY_INITIAL_DECK: undefined,

        // card sizes
        CARD_WIDTH: 288,
        CARD_HEIGHT: 488,
        PLACEHOLDER_WIDTH: 260,
        PLACEHOLDER_HEIGHT: 520,

        // ++++ UTILS +++++
        restartButton: restartTimelineButtonRo,
        // timeout for final start display
        timeoutStar1: 0,
        timeoutStar2: 80,
        timeoutStar3: 160,
        timeoutStarText: 250,

        //  ----- ERRORS -----
        errors: 0,
        persistentErrors: -1,
        historyErrors: -1,

        ERRORS_3_STARS: 3,
        ERRORS_2_STARS: 5,
        ERRORS_1_STARS: 10,
        // -------------------------------

        //  ----- CARDS && PLACEHOLDERS -----
        selectedCard: undefined,
        cards: [],
        placeholders: [],

        undiscoveredCardIds: new Set(),
        discoveredPlaceholders: new Set(),
        // -------------------------------

        // ----- STARS VARIABLES -----
        STAR_ROTATION_SPEED: 0.0,
        STAR_RADIUS: 80,

        startRotationParam: -0.3,
        // -------------------------------

        // ----- POP-UP variables -----
        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 900,
            popupHeight: 1600,
        },
        infoPopUpProperties: {
            dynamicRadius: 10,
            targetRadius: 30,
            currentSize: 20,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
        },
        // -------------------------------

        // ----- MATCH/WIN animation variables -----
        cardMatchProperties: {
            WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
            particles: [], // list of particles for card match animation.
            shouldDisplay: false,
            placeholder: -1, // placeholder to use in positioning card match animation.
            particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
            numberOfParticles: 55, // number of particles.
        },
        winProperties: {
            particles: [], // list of particles for win animation.
            finalWin: false, // reached the final stage where all cards match.
            posx: undefined,
            posy: undefined,
            timeoutTillStart: 30, // delay before starting the final win animation.
            placeholderModifier: {
                red: 0, // color of the placeholder when scrolling through matching cards at the end.
                green: 206,
                blue: 209,
                stroke: 0, // remove stroke at the end when changing placeholder colors.
                scale: 2, // scale placeholder while scrolling through matching cards at the end.
            },
            winStarHorizontalSpeed: 5,
        }

    }

    tl.POSX_INITIAL_CARD = width/2;
    tl.POSY_INITIAL_CARD = 1100;
    tl.POSY_INITIAL_DECK = 1500;

    // select 7 random image ids. they are ordered chronologically so should be arranged ascending.
    let numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    let selectedNumbers = selectUniqueNumbers(numbersArray, 7).sort((a, b) => a - b);
    print(selectedNumbers);

    tl.cards.push(new Card(selectedNumbers[0],(width/2) + 20, height+50, random(-1, - 0.9), random(-1, -0.6)));
    tl.cards.push(new Card(selectedNumbers[1], (width/2) + 10, height+40, random(1, 0.8), random(0.6, 1)));
    tl.cards.push(new Card(selectedNumbers[2], width/2, height+30, random(-0.5, -0.3), random(0.5, 0.9)));
    tl.cards.push(new Card(selectedNumbers[3], (width/2) - 10, height+20,)); // middle card
    tl.cards.push(new Card(selectedNumbers[4], (width/2) - 20, height+10, random(-0.2, 0.7), random(1, 0.6)));
    tl.cards.push(new Card(selectedNumbers[5], (width/2) - 30, height, random(1, 0.5), random(-1, -0.6)));
    tl.cards.push(new Card(selectedNumbers[6], (width/2) - 40, height-10, random(0.0, 0.0), random(-1, 0)));

    tl.placeholders.push(new Placeholder(1,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 3 - 90,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[0], 1978, "info card 7"));
    tl.placeholders.push(new Placeholder(2,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 2 - 60,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[1], 1981, "info card 1"));
    tl.placeholders.push(new Placeholder(3,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH - 30,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[2], 1982, "info card 2"));
    tl.placeholders.push(new Placeholder(4,
        tl.POSX_INITIAL_CARD,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[3], 1983, "info card 3"));
    tl.placeholders.push(new Placeholder(5,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH + 30,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[4], 1984, "info card 4"));
    tl.placeholders.push(new Placeholder(6,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 2 + 60,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[5], 1985, "info card 5"));
    tl.placeholders.push(new Placeholder(7,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 3 + 90,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        selectedNumbers[6], 1986, "info card 6"));

    touchTargets.push(new TouchTarget());

    //initialize winProperties animation to start at the position of the first placeholder.
    tl.winProperties.posx = tl.placeholders[0].posx;
    tl.winProperties.posy = tl.placeholders[0].posy;

    // initialize the set of undiscovered cards. this is used in displaying pop-ups.
    for (let i = 0; i < tl.cards.length; i++) {
        tl.undiscoveredCardIds.add(tl.cards[i].id);
    }
}

function drawTimeline() {
    background(timelineBg);

    // guiding lines center of the screen.
    // line(0, 840, width, 840);
    // line(0, height-840, width, height-840);

    // stroke(1);

    // display final win animation behind all cards.
    // check if all cards have been disclosed
    tl.winProperties.finalWin = tl.undiscoveredCardIds.size === 0
        && tl.winProperties.posx < tl.placeholders[tl.placeholders.length-1].posx + 10
        && tl.cardMatchProperties.particles.length === 0;
    // in final animation, display win animation for all placeholders and gradually remove them from the discovered set.
    if (tl.winProperties.finalWin) {
        tl.winProperties.timeoutTillStart--;
        if (tl.winProperties.timeoutTillStart < 0) {

            // change rect colors progressively as the particles move
            for (let j=0; j < tl.placeholders.length; j++) {
                if (tl.winProperties.posx >= tl.placeholders[j].posx - tl.winProperties.winStarHorizontalSpeed
                    && tl.winProperties.posx <= tl.placeholders[j].posx + tl.winProperties.winStarHorizontalSpeed) {
                    tl.placeholders[j].rectColorR = tl.winProperties.placeholderModifier.red;
                    tl.placeholders[j].rectColorG = tl.winProperties.placeholderModifier.green;
                    tl.placeholders[j].rectColorB = tl.winProperties.placeholderModifier.blue;
                    tl.placeholders[j].phStroke = tl.winProperties.placeholderModifier.stroke;
                    tl.placeholders[j].activeCard.scaleFactor = tl.winProperties.placeholderModifier.scale;
                    break;
                }
            }

            tl.winProperties.posx += tl.winProperties.winStarHorizontalSpeed;
        }
        initShowInfoPopUp(tl);
    }
    if (tl.undiscoveredCardIds.size === 0 && tl.winProperties.timeoutTillStart < 0) {
        createFinalWinParticlesAnimation(tl.winProperties.posx, tl.placeholders[tl.placeholders.length - 1].posx + 10, tl);
    }
    // -------- END final win animation


    // ------- initial card placeholders and card placement check
    checkPlaceholderCards();
    drawDiscoveredYears();
    // ----------------------------------

    // support for touch and desktop.
    if (touches.length == 0) {
        touchTargets[0].x=mouseX;
        touchTargets[0].y=mouseY;
    } else {
        touchTargets[0].x=touches[0].x;
        touchTargets[0].y=touches[0].y;
    }


    let winCard = undefined;
    // initialize and display the cards.
    for (let i = 0; i < tl.cards.length; i++) {
        let currentCard = tl.cards[i];

        if (!currentCard.initialized){
            currentCard.initialize();
        } else if (!currentCard.dispersed) {
            currentCard.disperse();
        } else if (currentCard.shouldBeReturned) {
            currentCard.returnToScatteredPosition();
        } else {
            // display card
            if (tl.cardMatchProperties.placeholder !== undefined
                && tl.cardMatchProperties.placeholder.activeCard !== undefined
                && tl.cardMatchProperties.placeholder.activeCard.id === currentCard.id) {
                winCard = currentCard; // draw this card later, after particles win animation.
            } else {
                currentCard.draw();
            }
        }
    }

    // if any win condition, draw win animation particles.

    //  ^^^^^^ WIN ANIMATIONS ^^^^^^^^^^^
    if (winCard !== undefined) {
        // avoid win animation on the first card that is already positioned on the right spot.
        if (!winCard.isFirstCard()){
            generateMatchParticles(tl);
        }
        winCard.draw();
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    // display pop-ups +++++++++++++++++++++++++++++++++++
    drawPopUp(tl);
    // +++++++++++++++++++++++++++++++++++++++


    // ++++++++ display info dialog +++++++
    if (isGameOver()) { // check if final win animation is over.
        // drawInfoPopUp(width/2, height/2, tl);
        drawWinStars(tl);
    }

    // ++++++++++++++++++++++++++++++++++++

    // DEBUG - display FPS
    if (random() > 0.9) {
        fps = (fps + frameRate())/2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + fps.toFixed(0), 20, 20);
    text("ERRORS: " + tl.historyErrors, 20, 40);

    textFont(fontNotoMedium);
    textStyle(NORMAL);
    textAlign(CENTER);
    textSize(90);
    fill(0);
    text('ISTORIA SPORTULUI', width/2, 300);

    textSize(45);
    textStyle(BOLD);
    text('Aranjează cărțile în ordine cronologică', width/2, 400);

    textFont(fontNotoLight);
    textStyle(NORMAL);
    text('și descoperă istoria sportului brașovean', width/2, 450);
}

function selectUniqueNumbers(arr, numToSelect) {
    if (arr.length < numToSelect) {
        console.log("Error: Not enough elements in the array to select from.");
        return [];
    }

    let selectedNumbers = [];
    let copiedArray = arr.slice(); // Create a copy of the original array to avoid modifying it

    for (let i = 0; i < numToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * copiedArray.length);
        selectedNumbers.push(copiedArray[randomIndex]);
        copiedArray.splice(randomIndex, 1);
    }

    return selectedNumbers;
}

function isGameOver() {
    return tl.winProperties.particles.length === 0
        && !tl.winProperties.finalWin
        && tl.undiscoveredCardIds.size === 0 && tl.cardMatchProperties.particles.length === 0 && tl.winProperties.timeoutTillStart < 0;;
}


function checkPlaceholderCards() {
    // reset cards active placeholders and set them later together with the placeholder settings.
    for (let i = 0; i < tl.cards.length; i++) {
        tl.cards[i].activePlaceholder = undefined;
    }

    tl.errors = 0;
    for (let i = 0; i < tl.placeholders.length; i++) {
        let currentPlaceholder = tl.placeholders[i];
        currentPlaceholder.activeCard = undefined;
        currentPlaceholder.draw();

        // check if card should be snapped into placeholder.
        for (let i = 0; i < tl.cards.length; i++) {
            let currentCard = tl.cards[i];
            if (currentPlaceholder.isCardOver(currentCard) && currentPlaceholder.activeCard === undefined) {
                // set active card and placeholder to each other.
                currentPlaceholder.activeCard = currentCard;
                currentCard.activePlaceholder = currentPlaceholder;

                // if a card has been discovered AND is correct, display pop-up and remove it from the undiscovered set.
                // this prevents repeated displays of pop-ups over already discovered cards.
                if (!isAnySelectedCard() && currentPlaceholder.activeCard.id === currentPlaceholder.correctCardId
                    && tl.undiscoveredCardIds.has(currentCard.id)) {
                    tl.undiscoveredCardIds.delete(currentCard.id);
                    tl.discoveredPlaceholders.add(currentPlaceholder);

                    initShowPopUp(tl,currentPlaceholder);
                    initDisplayMatchAnimation(currentPlaceholder, tl); // display win animation particles.
                }
            }
        }

        // counter errors.
        if (!isAnySelectedCard()
            && currentPlaceholder.activeCard !== undefined
            && currentPlaceholder.activeCard.id !== currentPlaceholder.correctCardId) {

            tl.errors++;
            currentPlaceholder.activeCard.shouldBeReturned = true;
            currentPlaceholder.showWrongAnimation = true;
            currentPlaceholder.activeCard.activePlaceholder = undefined;
            currentPlaceholder.activeCard = undefined;
        }
    }

    // this keeps track of real errors during the whole game.
    countPersistentErrors();

}


function drawDiscoveredYears() {
    for (let item of tl.discoveredPlaceholders) {
        fill(0);
        stroke(1);
        strokeWeight(1);
        textSize(60);
        textFont(fontZebrra);
        text(item.year, item.posx, item.posy + item.height/2 + 40);
    }
}

function countPersistentErrors() {
    if (tl.errors !== tl.persistentErrors && !isAnySelectedCard()) {
        if (tl.errors > tl.persistentErrors) {
            tl.historyErrors++;
        }
        tl.persistentErrors = tl.errors;
    }
}

function isAnySelectedCard() {
    return tl.selectedCard !== undefined;
}

function clearSelectedCard() {
    tl.selectedCard = undefined;
}


// *********** MOUSE AND TOUCH EVENTS **************************

// desktop support
function mousePressed() {
    if (activeGame === mem.propertiesIdentifier) {
        checkInfoPopUpClosed(mem);
        initHidePopUp(mem);
    }
    if (activeGame === tl.propertiesIdentifier) {
        touchStarted();
        // restart game.
        if (isGameOver() && mouseX > 800 && mouseX < 1330 && mouseY > 2370 && mouseY < 2450) {
            tl.isInitialized = false;
            setup();
            tl.isInitialized = true;
        }
    }
}

function touchEnded() {
    for (let i = 0; i < tl.cards.length; i++) {
        tl.cards[i].resetRotation(false);
    }
    clearSelectedCard();
}

function mouseReleased() {
    touchEnded();
}

function touchMoved(){
    touchStarted();
    if (isAnySelectedCard()) {
        tl.selectedCard.posx = touchTargets[0].x;
        tl.selectedCard.posy = touchTargets[0].y;
    }
}

function mouseDragged() {
    touchMoved();
}

function touchStarted() {
    // decide order of the cards based on mouseposition ------
    if (!isAnySelectedCard()) {
        for (let i = 0; i < tl.cards.length; i++) {
            let activeCard = tl.cards[i];
            if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                tl.cards.splice(i, 1);
                tl.cards.push(activeCard);
                tl.selectedCard = activeCard;
                // straighten the selected card
                tl.selectedCard.resetRotation(true);
                // break;
            }
        }

        // clear active pop-up if any.
        initHidePopUp(tl);
    }

    checkInfoPopUpClosed(tl);

}

// +++++++++++++++++++++++ MEMORY GAME +++++++++++++++++++++++++

function initializeMemory() {
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);

    mem = {
        fps: 0,
        propertiesIdentifier: "mem",
        isInitialized: false,
        maskImg: undefined,
        icons: [],
        images: [],
        burnedImages: new Set(), // images that have already been selected by randomness and should not be selected anymore in current game.

        nextButton: undefined,

        gameState: {
            isLevelOver: false,
            isWon: false,
            isLost: false,
            isGameOver: false,
            levelNumber: 1,
            MAX_LEVELS: 5,
            originalNumberOfIcons: undefined, // used in error calculation.
        },


        // ----- STARS VARIABLES -----
        STAR_ROTATION_SPEED: 0.01,
        STAR_RADIUS: 145,
        startRotationParam: 0,
        // -------------------------------


        infoPopUpProperties: {
            dynamicRadius: 10,
            targetRadius: 30,
            currentSize: 20,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
        },

        cardPopUpProperties: {
            dynamicRadius: 0,
            targetRadius: 30,
            currentSize: 0,
            elasticity: 0.07,
            velocity: 2,
            position: 0,
            inc: 3,
            displayPopUp: false,
            showPropertiesInitialized: false,
            hidePropertiesInitialized: false,
            popupWidth: 2400,
            popupHeight: 1000,
            popupPosx: 1080,
            popupPosy: 2720,
        },

        // levels of error
        ERRORS_LEVEL_1: 2, // reveal first layer
        ERRORS_LEVEL_2: 3, // reveal whole image
        ERRORS_LEVEL_3: 4, // game over

        ERRORS_3_STARS: 3,
        ERRORS_2_STARS: 5,
        ERRORS_1_STARS: 10,

        EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT: -500,
        EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT: 500,

        // this controls the limits within which cards can move on posY
        POSY_OFFSET_DISPERSE_LEFT_LIMIT: -50,
        POSY_OFFSET_DISPERSE_RIGHT_LIMIT: 50,

        // ------- ERRORS ---------
        persistentErrors: 0,
        historyErrors: 0,
        // ------------------------

        cardMatchProperties: {
            WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
            particles: [], // list of particles for card match animation.
            shouldDisplay: false,
            particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
            numberOfParticles: 15, // number of particles.
            placeholder: undefined,
        }

    }

    // Memory game
    for (let i=0; i<loadedImages.length; i++){
        mem.images.push(loadedImages[i]);
    }

    initializeNewImage();
    initializeIcons();
}


function removeRemainingWrongIcons() {
    for (let i = 0; i < mem.icons.length; i++) {
        if (mem.icons[i].id !== mem.maskImg.associatedId) {
            mem.icons[i].wrongIconSelection();
        }
    }
}

// calculate number of errors, display additional image levels as errors increase, display next
function processErrors() {
    if (!mem.gameState.isLevelOver && !mem.gameState.isGameOver) {
        mem.historyErrors = mem.gameState.originalNumberOfIcons - mem.icons.length;
        mem.maskImg.zoomLevel = mem.historyErrors;

        // if minimum numbers of icons are left -> game over and remove all other icons.
        // this also checks if last wrong icon finished animation.
        if (mem.historyErrors >= mem.ERRORS_LEVEL_3 && mem.icons.length <= mem.gameState.originalNumberOfIcons - mem.ERRORS_LEVEL_3) {
            removeRemainingWrongIcons();
        }

        // process when game is over for current image
        if (mem.icons.length === 1) {
            mem.gameState.isLevelOver = true;
            mem.gameState.isLost = true;
        }

        if (mem.gameState.levelNumber > mem.gameState.MAX_LEVELS) {
            mem.gameState.isGameOver = true;
        }
    }
}

// removes icons that have been zoomed out.
function removeInvisibleIcons() {
    for (let i = 0; i < mem.icons.length; i++) {
        if (mem.icons[i].scaleFactor < 0) {
            mem.icons.splice(i, 1);
            break;
        }
    }
}

function resetNewGame() {
    initializeNewImage();
    mem.persistentErrors += mem.historyErrors; // preserve history errors from previous level.
    mem.icons = [];

    initializeIcons();
    initHidePopUp(mem);

    mem.gameState.isLevelOver = false;
    mem.gameState.isWon = false;
    mem.gameState.isLost = false;
    mem.gameState.isLevelOver = false;

    mem.gameState.levelNumber++;
}

function drawMemory() {
    background(220);

    // guiding lines center of the screen.
    line(0, 840, width, 840);
    line(0, height - 840, width, height - 840);

    if (!mem.gameState.isGameOver) {
        mem.maskImg.draw();

        generateMatchParticles(mem);

        // icons display and click logic.
        for (let i = 0; i < mem.icons.length; i++) {
            let currentIcon = mem.icons[i];
            currentIcon.disperse();
            currentIcon.draw();

            if (currentIcon.isActive(mouseX, mouseY)) {
                if (mem.maskImg.associatedId === currentIcon.id) { // correct icon selected.
                    if (!currentIcon.correctIconSelected) {
                        currentIcon.correctIconSelection();
                        initDisplayMatchAnimation(currentIcon, mem);
                        initShowPopUp(mem);

                        mem.gameState.isWon = true;
                        mem.gameState.isLevelOver = true;
                    }
                } else { // wrong icon selected.
                    currentIcon.wrongIconSelection();
                    // break;
                }
            }
        }
    }

    removeInvisibleIcons();
    processErrors();

    // next button logic
    if (mem.gameState.isLevelOver) {
        initShowPopUp(mem);
        removeRemainingWrongIcons();

        mem.maskImg.zoomLevel = mem.ERRORS_LEVEL_3; // display whole image.

        if (mem.gameState.isGameOver) {
            mem.nextButton.isVisible = false;
            mem.infoPopUpProperties.displayPopUp = true;
        } else {
            mem.nextButton.isVisible = true;
            if (mem.nextButton.isClicked(mouseX, mouseY)) {
                resetNewGame();
            }
        }

    }
    mem.nextButton.draw();

    // DEBUG - display FPS
    if (random() > 0.9) {
        mem.fps = (mem.fps + frameRate()) / 2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + mem.fps.toFixed(0), 20, 20);
    text("ERRORS: " + mem.persistentErrors, 20, 40);

    if (mem.gameState.isGameOver) {
        initShowInfoPopUp(mem);
    }

    drawInfoPopUp(width / 2, height / 2, mem);

    drawPopUp(mem);
    // print('popup:' + mem.cardMatchProperties.placeholder.posx + ':' + mem.cardMatchProperties.placeholder.posy);
}


function initializeNewImage() {
    let randomImg = random(mem.images);
    while (mem.burnedImages.has(randomImg[1])) { // keep selecting till new image is selected.
        randomImg = random(mem.images);
    }
    let img = randomImg[0]; // index 0 is the loaded image, index 1 is the unique id of the image.
    mem.burnedImages.add(randomImg[1]); // add image unique ID.

    let cropSize1 = 300;
    let crop1 = new CropSettings(cropSize1, cropSize1, img.width / 2 - cropSize1 / 2, img.height / 2 - cropSize1 / 2);
    let cropSize2 = 600;
    let crop2 = new CropSettings(cropSize2, cropSize2, img.width / 2 - cropSize2 / 2, img.height / 2 - cropSize2 / 2);
    let cropSize3 = 1800; // whole image reveal
    let crop3 = new CropSettings(cropSize3, cropSize3, img.width / 2 - cropSize3 / 2, img.height / 2 - cropSize3 / 2);

    mem.maskImg = new MaskImage(img, 2, crop1, crop2, crop3, mem);

    mem.nextButton = new Button(width - 100, height/2, 50, 50);
}

function initializeIcons() {
    mem.icons = [];
    mem.icons.push(new Icon(1, (width / 2), height / 2, 1, -0.33, mem));
    mem.icons.push(new Icon(2, (width / 2), height / 2, -1, -0.33, mem));
    mem.icons.push(new Icon(3, width / 2, height / 2, 0.33, -1, mem));
    mem.icons.push(new Icon(4, (width / 2), height / 2, 0.33, 1, mem));
    mem.icons.push(new Icon(5, (width / 2), height / 2, -0.33, -1, mem));
    mem.icons.push(new Icon(6, (width / 2), height / 2, -0.33, 1, mem));
    mem.icons.push(new Icon(7, (width / 2), height / 2, 1, 0.33, mem));
    mem.icons.push(new Icon(8, (width / 2), height / 2, -1, 0.33, mem));

    mem.gameState.originalNumberOfIcons = mem.icons.length;
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// *************************************************************

document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
    e.preventDefault();

    document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
    e.preventDefault();
    document.body.style.zoom = 1;
});