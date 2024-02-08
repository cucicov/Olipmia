let fps = 0;
let touchTargets = [];

let tl = {
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
    CARD_WIDTH: 240,
    CARD_HEIGHT: 500,
    PLACEHOLDER_WIDTH: 260,
    PLACEHOLDER_HEIGHT: 520,

    //  ----- ERRORS -----
    errors: 0,
    persistentErrors: -1,
    historyErrors: -1,
    // -------------------------------

    //  ----- CARDS && PLACEHOLDERS -----
    selectedCard: undefined,
    cards: [],
    placeholders: [],

    undiscoveredCardIds: new Set(),
    discoveredPlaceholders: new Set(),
    // -------------------------------

    // ----- STARS VARIABLES -----
    STAR_ROTATION_SPEED: 0.01,
    STAR_RADIUS: 145,

    startRotationParam: 0,
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

// -------------------------------

function setup() {
    initializeTimeline();
}

function draw() {
    drawTimeline();
}

function initializeTimeline() {
    createCanvas(2160, 3840);

    tl.POSX_INITIAL_CARD = width/2;
    tl.POSY_INITIAL_CARD = 1300;
    tl.POSY_INITIAL_DECK = 1300;

    tl.cards.push(new Card(1,(width/2) + 20, height+50, random(-1, - 0.9), random(-1, -0.6)));
    tl.cards.push(new Card(2, (width/2) + 10, height+40, random(1, 0.8), random(0.6, 1)));
    tl.cards.push(new Card(3, width/2, height+30, )); // middle card
    tl.cards.push(new Card(4, (width/2) - 10, height+20, random(-0.5, -0.3), random(0.5, 0.9)));
    tl.cards.push(new Card(5, (width/2) - 20, height+10, random(-0.2, 0.7), random(1, 0.6)));
    tl.cards.push(new Card(6, (width/2) - 30, height, random(1, 0.5), random(-1, -0.6)));
    tl.cards.push(new Card(7, (width/2) - 40, height-10, random(0.0, 0.0), random(-1, 0)));

    tl.placeholders.push(new Placeholder(7,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 3 - 48,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        7, 1978, "info card 7"));
    tl.placeholders.push(new Placeholder(1,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH * 2 - 32,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        1, 1981, "info card 1"));
    tl.placeholders.push(new Placeholder(2,
        tl.POSX_INITIAL_CARD - tl.PLACEHOLDER_WIDTH - 16,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        2, 1982, "info card 2"));
    tl.placeholders.push(new Placeholder(3,
        tl.POSX_INITIAL_CARD,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        3, 1983, "info card 3"));
    tl.placeholders.push(new Placeholder(4,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH + 16,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        4, 1984, "info card 4"));
    tl.placeholders.push(new Placeholder(5,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 2 + 32,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        5, 1985, "info card 5"));
    tl.placeholders.push(new Placeholder(6,
        tl.POSX_INITIAL_CARD + tl.PLACEHOLDER_WIDTH * 3 + 48,
        tl.POSY_INITIAL_CARD,
        tl.PLACEHOLDER_WIDTH,
        tl.PLACEHOLDER_HEIGHT,
        6, 1986, "info card 6"));

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
    background(220);

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
        drawInfoPopUp(width/2, height/2, tl);
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

                    initShowPopUp(currentPlaceholder, tl);
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
        textSize(44);
        text(item.year, item.posx - 50, item.posy + item.height/2 + 50);
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
    touchStarted();
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