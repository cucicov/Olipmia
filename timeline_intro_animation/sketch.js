let fps = 0;
let touchTargets = [];

// this controls the limits of within which cards can move on posX
const EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT = -150;
const EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT = 150;

// this controls the limits within which cards can move on posY
const POSY_OFFSET_DISPERSE_LEFT_LIMIT = -15;
const POSY_OFFSET_DISPERSE_RIGHT_LIMIT = 10;

// position for the initial card starting the game
let POSY_INITIAL_CARD;
let POSX_INITIAL_CARD;




//  ----- ERRORS -----
let errors = 0;
let persistentErrors = -1;
let historyErrors = -1;
// -------------------------------

//  ----- CARDS && PLACEHOLDERS -----
let selectedCard;
let cards = [];
let placeholders = [];

let undiscoveredCardIds = new Set();
let discoveredPlaceholders = new Set();
// -------------------------------

// ----- STARS VARIABLES -----
const STAR_ROTATION_SPEED = 0.01;
const STAR_RADIUS = 45;
let startRotationParam = 0;
// -------------------------------




// ----- POP-UP variables -----
let cardPopUpProperties = {
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
}

let infoPopUpProperties = {
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
}
// -------------------------------

// ----- MATCH/WIN animation variables -----
let cardMatchProperties = {
    WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
    particles: [], // list of particles for card match animation.
    shouldDisplay: false,
    placeholder: -1, // placeholder to use in positioning card match animation.
    particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
    numberOfParticles: 15, // number of particles.
}

let winProperties = {
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
}

// -------------------------------

function setup() {
    createCanvas(600, 800);

    POSX_INITIAL_CARD = width/2;
    POSY_INITIAL_CARD = 300;

    cards.push(new Card(1,(width/2) + 4, height+13, random(-1, - 0.9), random(-1, -0.6)));
    cards.push(new Card(2, (width/2) + 2, height+10, random(1, 0.8), random(0.6, 1)));
    cards.push(new Card(3, width/2, height+7, )); // middle card
    cards.push(new Card(4, (width/2) - 2, height+4, random(-0.5, -0.3), random(0.5, 0.9)));
    cards.push(new Card(5, (width/2) - 4, height+1, random(-0.2, 0.7), random(1, 0.6)));
    cards.push(new Card(6, (width/2) - 6, height-2, random(1, 0.5), random(-1, -0.6)));
    cards.push(new Card(7, (width/2) - 6, height-2, random(0.0, 0.0), random(-1, 0)));

    placeholders.push(new Placeholder(7, POSX_INITIAL_CARD - 180, POSY_INITIAL_CARD, 56, 106, 7, 1978, "info card 7"));
    placeholders.push(new Placeholder(1, POSX_INITIAL_CARD - 120, POSY_INITIAL_CARD, 56, 106, 1, 1981, "info card 1"));
    placeholders.push(new Placeholder(2, POSX_INITIAL_CARD - 60, POSY_INITIAL_CARD, 56, 106, 2, 1982, "info card 2"));
    placeholders.push(new Placeholder(3, POSX_INITIAL_CARD, POSY_INITIAL_CARD, 56, 106, 3, 1983, "info card 3"));
    placeholders.push(new Placeholder(4, POSX_INITIAL_CARD + 60, POSY_INITIAL_CARD, 56, 106, 4, 1984, "info card 4"));
    placeholders.push(new Placeholder(5, POSX_INITIAL_CARD + 120, POSY_INITIAL_CARD, 56, 106, 5, 1985, "info card 5"));
    placeholders.push(new Placeholder(6, POSX_INITIAL_CARD + 180, POSY_INITIAL_CARD, 56, 106, 6, 1986, "info card 6"));

    touchTargets.push(new TouchTarget());

    //initialize winProperties animation to start at the position of the first placeholder.
    winProperties.posx = placeholders[0].posx;
    winProperties.posy = placeholders[0].posy;

    // initialize the set of undiscovered cards. this is used in displaying pop-ups.
    for (let i = 0; i < cards.length; i++) {
        undiscoveredCardIds.add(cards[i].id);
    }
}


function draw() {
    background(220);
    // stroke(1);

    // display final win animation behind all cards.
    // check if all cards have been disclosed
    winProperties.finalWin = undiscoveredCardIds.size === 0
        && winProperties.posx < placeholders[placeholders.length-1].posx + 10
        && cardMatchProperties.particles.length === 0;
    // in final animation, display win animation for all placeholders and gradually remove them from the discovered set.
    if (winProperties.finalWin) {
        winProperties.timeoutTillStart--;
        if (winProperties.timeoutTillStart < 0) {

            // change rect colors progressively as the particles move
            for (let j=0; j < placeholders.length; j++) {
                if (winProperties.posx === placeholders[j].posx) {
                    placeholders[j].rectColorR = winProperties.placeholderModifier.red;
                    placeholders[j].rectColorG = winProperties.placeholderModifier.green;
                    placeholders[j].rectColorB = winProperties.placeholderModifier.blue;
                    placeholders[j].phStroke = winProperties.placeholderModifier.stroke;
                    placeholders[j].activeCard.scaleFactor = winProperties.placeholderModifier.scale;
                    break;
                }
            }

            winProperties.posx += 2;
        }
        initShowInfoPopUp();
    }
    if (undiscoveredCardIds.size === 0 && winProperties.timeoutTillStart < 0) {
        createFinalWinParticlesAnimation(winProperties.posx, placeholders[placeholders.length - 1].posx + 10);
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
    for (let i = 0; i < cards.length; i++) {
        let currentCard = cards[i];

        if (!currentCard.initialized){
            currentCard.initialize();
        } else if (!currentCard.dispersed) {
            currentCard.disperse();
        } else if (currentCard.shouldBeReturned) {
            currentCard.returnToScatteredPosition();
        } else {
            // display card
            if (cardMatchProperties.placeholder !== undefined
                && cardMatchProperties.placeholder.activeCard !== undefined
                && cardMatchProperties.placeholder.activeCard.id === currentCard.id) {
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
            generateMatchParticles();
        }
        winCard.draw();
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    // display pop-ups +++++++++++++++++++++++++++++++++++
    drawPopUp();
    // +++++++++++++++++++++++++++++++++++++++


    // ++++++++ display info dialog +++++++
    if (winProperties.particles.length === 0 && !winProperties.finalWin) { // check if final win animation is over.
        drawInfoPopUp(width/2, height/2);
    }
    // ++++++++++++++++++++++++++++++++++++

    // DEBUG - display FPS
    if (random() > 0.9) {
        fps = (fps + frameRate())/2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + fps.toFixed(0), 20, 20);
    text("ERRORS: " + historyErrors, 20, 40);
}


function drawRotatingStar(posx, posy, isWinStart) {
    startRotationParam += STAR_ROTATION_SPEED;

    if (isWinStart) {
        fill(255, 215, 0);
    } else {
        fill(120,120,120);
    }

    noStroke();
    beginShape();
    vertex(posx + STAR_RADIUS * cos(TWO_PI * 0/5 + startRotationParam),posy + STAR_RADIUS * sin(TWO_PI * 0/5 + startRotationParam));
    vertex(posx + STAR_RADIUS * cos(TWO_PI * 2/5 + startRotationParam),posy + STAR_RADIUS * sin(TWO_PI * 2/5 + startRotationParam));
    vertex(posx + STAR_RADIUS * cos(TWO_PI * 4/5 + startRotationParam),posy + STAR_RADIUS * sin(TWO_PI * 4/5 + startRotationParam));
    vertex(posx + STAR_RADIUS * cos(TWO_PI * 1/5 + startRotationParam),posy + STAR_RADIUS * sin(TWO_PI * 1/5 + startRotationParam));
    vertex(posx + STAR_RADIUS * cos(TWO_PI * 3/5 + startRotationParam),posy + STAR_RADIUS * sin(TWO_PI * 3/5 + startRotationParam));
    endShape(CLOSE);
}

function createFinalWinParticlesAnimation(posx, finalPosx) {
    if (posx < finalPosx) {
        for (let i = 0; i < 1; i++) {
            let particle = new Particle(posx, winProperties.posy, true);
            winProperties.particles.push(particle);
        }
    }

    // Update and display each particle
    for (let i = winProperties.particles.length - 1; i >= 0; i--) {
        winProperties.particles[i].update();
        winProperties.particles[i].display();

        // Remove particles that are no longer visible
        if (winProperties.particles[i].isOffScreen()) {
            winProperties.particles.splice(i, 1);
        }
    }
}

function initDisplayMatchAnimation(placeholder) {
    cardMatchProperties.shouldDisplay = true;
    cardMatchProperties.placeholder = placeholder;
    cardMatchProperties.particleAnimationDuration = cardMatchProperties.WIN_PARTICLE_ANIMATION_DURATION;
}

function generateMatchParticles() {
    if (cardMatchProperties.shouldDisplay) {
        cardMatchProperties.particleAnimationDuration--;
        for (let i = 0; i < cardMatchProperties.numberOfParticles; i++) {
            let particle = new Particle(cardMatchProperties.placeholder.posx, cardMatchProperties.placeholder.posy);
            cardMatchProperties.particles.push(particle);
        }

        if (cardMatchProperties.particleAnimationDuration < 0) {
            cardMatchProperties.shouldDisplay = false;
        }
    }

    // Update and display each particle
    for (let i = cardMatchProperties.particles.length - 1; i >= 0; i--) {
        cardMatchProperties.particles[i].update();
        cardMatchProperties.particles[i].display();

        // Remove particles that are no longer visible
        if (cardMatchProperties.particles[i].isOffScreen()) {
            cardMatchProperties.particles.splice(i, 1);
        }
    }
}


function checkPlaceholderCards() {
    // reset cards active placeholders and set them later together with the placeholder settings.
    for (let i = 0; i < cards.length; i++) {
        cards[i].activePlaceholder = undefined;
    }

    errors = 0;
    for (let i = 0; i < placeholders.length; i++) {
        let currentPlaceholder = placeholders[i];
        currentPlaceholder.activeCard = undefined;
        currentPlaceholder.draw();

        // check if card should be snapped into placeholder.
        for (let i = 0; i < cards.length; i++) {
            let currentCard = cards[i];
            if (currentPlaceholder.isCardOver(currentCard) && currentPlaceholder.activeCard === undefined) {
                // set active card and placeholder to each other.
                currentPlaceholder.activeCard = currentCard;
                currentCard.activePlaceholder = currentPlaceholder;

                // if a card has been discovered AND is correct, display pop-up and remove it from the undiscovered set.
                // this prevents repeated displays of pop-ups over already discovered cards.
                if (!isAnySelectedCard() && currentPlaceholder.activeCard.id === currentPlaceholder.correctCardId
                    && undiscoveredCardIds.has(currentCard.id)) {
                    undiscoveredCardIds.delete(currentCard.id);
                    discoveredPlaceholders.add(currentPlaceholder);

                    initShowPopUp(currentPlaceholder);
                    initDisplayMatchAnimation(currentPlaceholder); // display win animation particles.
                }
            }
        }

        // counter errors.
        if (!isAnySelectedCard() && currentPlaceholder.activeCard !== undefined && currentPlaceholder.activeCard.id !== currentPlaceholder.correctCardId) {
            errors++;
            currentPlaceholder.activeCard.shouldBeReturned = true;
            currentPlaceholder.showWrongCardAnimation();
            // currentPlaceholder.activeCard.posx = currentPlaceholder.activeCard.initialPosXAfterScatter;
            // currentPlaceholder.activeCard.posy = currentPlaceholder.activeCard.initialPosYAfterScatter;
            currentPlaceholder.activeCard.activePlaceholder = undefined;
            currentPlaceholder.activeCard = undefined;
        }
    }

    // this keeps track of real errors during the whole game.
    countPersistentErrors();

}


function drawPopUp() {
    if (cardPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(cardPopUpProperties);

        push();
        noStroke();
        fill(255);
        translate(cardMatchProperties.placeholder.posx, cardMatchProperties.placeholder.posy - cardMatchProperties.placeholder.height - 20);
        scale(scaleRatio);
        rectMode(CENTER);
        rect(0, 0, 400, 200, 30);
        triangle(-40, 75, 0, 125, 40, 75);
        pop();

        if (scaleRatio === 0) {
            cardPopUpProperties.displayPopUp = false;
        }
    }
}


function initShowInfoPopUp() {
    if (!infoPopUpProperties.showPropertiesInitialized) {
        infoPopUpProperties.dynamicRadius = 10;
        infoPopUpProperties.targetRadius = 30;
        infoPopUpProperties.currentSize = 20;
        infoPopUpProperties.elasticity = 0.07;
        infoPopUpProperties.velocity = 2;
        infoPopUpProperties.position = 0;
        infoPopUpProperties.inc = 3;

        infoPopUpProperties.displayPopUp = true;
        infoPopUpProperties.showPropertiesInitialized = true;
        infoPopUpProperties.hidePropertiesInitialized = false;
    }
}


function initHideInfoPopUp() {
    if (!infoPopUpProperties.hidePropertiesInitialized) {
        infoPopUpProperties.dynamicRadius = 0;
        infoPopUpProperties.targetRadius = 10;
        infoPopUpProperties.currentSize = 0;
        infoPopUpProperties.elasticity = 0.05;
        infoPopUpProperties.velocity = 12;
        infoPopUpProperties.position = 20;
        infoPopUpProperties.inc = 0;

        infoPopUpProperties.showPropertiesInitialized = false;
        infoPopUpProperties.hidePropertiesInitialized = true;
    }
}

function calculatePopUpScaleRatio(properties) {
    if (properties.dynamicRadius <= 50) {
        properties.dynamicRadius += properties.inc;
    }

    // Apply elastic force
    let force = (properties.targetRadius - properties.currentSize) * properties.elasticity;
    properties.velocity += force;
    properties.position += properties.velocity;

    // Update the size
    properties.currentSize = max(0, properties.position) + properties.dynamicRadius;
    let scaleRatio = map(properties.currentSize, 0, 52, 0, 0.5);
    return scaleRatio;
}

function drawInfoPopUp(posx, posy) {
    if (infoPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(infoPopUpProperties);

        push();
        noStroke();
        fill(255);
        translate(posx, posy);
        scale(scaleRatio);
        rectMode(CENTER);
        rect(0, 0, 800, 800, 30);
        stroke(1);
        strokeWeight(3);

        // X
        line(320, -360, 360, -320);
        line(360, -360, 320, -320);

        // stars

        let star1Win = historyErrors < 10;
        let star2Win = historyErrors < 3;
        let star3Win = historyErrors === 0;
        drawRotatingStar(0 - 100, 0 - 280, star1Win);
        drawRotatingStar(0, 0 - 280, star2Win);
        drawRotatingStar(0 + 100, 0 - 280, star3Win);

        pop();

        if (scaleRatio === 0) {
            infoPopUpProperties.displayPopUp = false;
        }

    }
}

function initShowPopUp(placeholder) {
    if (!cardPopUpProperties.showPropertiesInitialized) {
        cardMatchProperties.placeholder = placeholder; // this is saved in the more general cardMatchProperties object.

        cardPopUpProperties.currentSize = 0;
        cardPopUpProperties.position = 0;
        cardPopUpProperties.velocity = 2;
        cardPopUpProperties.targetRadius = 30;
        cardPopUpProperties.elasticity = 0.07;
        cardPopUpProperties.dynamicRadius = 0;
        cardPopUpProperties.inc = 3;

        cardPopUpProperties.showPropertiesInitialized = true;
        cardPopUpProperties.hidePropertiesInitialized = false;
        cardPopUpProperties.displayPopUp = true;
    }
}

function initHidePopUp() {
    if (!cardPopUpProperties.hidePropertiesInitialized) {
        cardPopUpProperties.currentSize = 0;
        cardPopUpProperties.position = 20;
        cardPopUpProperties.velocity = 12;
        cardPopUpProperties.targetRadius = 10;
        cardPopUpProperties.elasticity = 0.05;
        cardPopUpProperties.dynamicRadius = 0;
        cardPopUpProperties.inc = 0;

        cardPopUpProperties.hidePropertiesInitialized = true;
        cardPopUpProperties.showPropertiesInitialized = false;
    }
}

function drawDiscoveredYears() {
    for (let item of discoveredPlaceholders) {
        fill(0);
        stroke(1);
        strokeWeight(1);
        text(item.year, item.posx - 18, item.posy + item.height/2 + 20);
    }
}

function countPersistentErrors() {
    if (errors !== persistentErrors && !isAnySelectedCard()) {
        if (errors > persistentErrors) {
            historyErrors++;
        }
        persistentErrors = errors;
    }
}


function isAnySelectedCard() {
    return selectedCard !== undefined;
}

function clearSelectedCard() {
    selectedCard = undefined;
}

function checkInfoPopUpClosed() {
    if (mouseX > 460 && mouseX < 480 && mouseY < 240 && mouseY > 220) {
        initHideInfoPopUp();
    }
}

function touchStarted() {
    // decide order of the cards based on mouseposition ------
    if (!isAnySelectedCard()) {
        for (let i = 0; i < cards.length; i++) {
            let activeCard = cards[i];
            if (activeCard.isActive(touchTargets[0].x, touchTargets[0].y)) {
                cards.splice(i, 1);
                cards.push(activeCard);
                selectedCard = activeCard;
                // straighten the selected card
                selectedCard.resetRotation(true);
                // break;
            }
        }

        // clear active pop-up if any.
        initHidePopUp();
    }

    checkInfoPopUpClosed();

}
// desktop support
function mousePressed() {
    touchStarted();
}

function touchEnded() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].resetRotation(false);
    }
    clearSelectedCard();
}

function mouseReleased() {
    touchEnded();
}

function touchMoved(){
    touchStarted();
    if (isAnySelectedCard()) {
        selectedCard.posx = touchTargets[0].x;
        selectedCard.posy = touchTargets[0].y;
    }
}

function mouseDragged() {
    touchMoved();
}


//// CLASSES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

class TouchTarget {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class Placeholder {
    /*
    * @param id - unique id of the placeholder
    * @param posx - position of the placeholder
    * @param posy - position of the placeholder
    * @param width - dimensions of the placeholder
    * @param height - dimensions of the placeholder
    * @param cardId - the correct card id to be associated with the placeholder.
    * @param year - year associated with the card of the placeholder.
    * @param info - the correct card id to be associated with the placeholder.
     */
    constructor(id, posx, posy, width, height, cardId, year, info) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.correctCardId = cardId; // correct card id.

        this.activeCard = 0; // actively associated card.

        // INFO
        this.year = year;
        this.info = info;

        // UTILITIES
        this.showWrongAnimation = false;
        this.wrongAnimationAmplitude = 50;
        this.wrongAnimationFrequency = 0.07;
        this.initialPosy = posy; // keep original position for wrong animation.
        this.internalFrameCount = 0;
        this.GRAY_COLOR_TINT = 200;
        this.rectColorR = this.GRAY_COLOR_TINT;
        this.rectColorG = this.GRAY_COLOR_TINT;
        this.rectColorB = this.GRAY_COLOR_TINT;
        this.phStroke = 1;

    }

    isCardOver(activeCard) {
        if (this.posx > (activeCard.posx - activeCard.width/2) &&
            this.posx < (activeCard.posx + activeCard.width/2) &&
            this.posy > (activeCard.posy - activeCard.height/2) &&
            this.posy < (activeCard.posy + activeCard.height/2)) {
            return true;
        } else {
            return false;
        }
    }

    draw() {
        // check if should display wrong card animation on placeholder.
        this.checkWrongCardAnimation();

        rectMode(CENTER);
        stroke(this.phStroke);
        strokeWeight(this.phStroke);
        fill(this.rectColorR, this.rectColorG, this.rectColorB);
        rect(this.posx, this.posy, this.width, this.height);
    }

    showWrongCardAnimation() {
        this.showWrongAnimation = true;
    }

    checkWrongCardAnimation() {
        this.internalFrameCount++;
        if (this.showWrongAnimation) {
            if (this.internalFrameCount > 0) {
                let sinParam = sin(this.internalFrameCount * this.wrongAnimationFrequency);

                // modify also placeholder fill value.
                this.rectColorR = this.GRAY_COLOR_TINT + sinParam * 50;
                this.rectColorG = this.GRAY_COLOR_TINT - sinParam * 100;
                this.rectColorB = this.GRAY_COLOR_TINT - sinParam * 100;

                this.posy = this.initialPosy + this.wrongAnimationAmplitude * sinParam;

                if (this.internalFrameCount * this.wrongAnimationFrequency >= PI) {
                    this.showWrongAnimation = false; // Stop the animation when it completes one full cycle
                    this.posy = this.initialPosy;
                }
            }
        } else {
            this.internalFrameCount = -25; // delay before starting the wrong animation.
        }
    }
}

class Particle {
    constructor(x, y, multicolor) {
        this.x = x;
        this.y = y;
        this.alpha = 255;
        if (multicolor) {
            this.color = color(random(0, 120), random(80, 220), random(180, 255));
            this.vx = random(-7, 7);
            this.vy = random(-7, 7);
            this.scaleFactor = 0.01;
            this.size = random(7, 15);
            this.alphaFactor = 3;
            this.gravity = 0; // Gravity force
        } else {
            this.color = color(random([[255, 236, 139], [255, 215, 0], [184, 134, 11], [218, 165, 32], [238, 232, 170]]));
            this.vx = random(-7, 7);
            this.vy = random(-7, 7);
            this.scaleFactor = 0.05;
            this.size = random(5, 10);
            this.alphaFactor = 3;
            this.gravity = 0.05; // Gravity force
        }
    }

    update() {
        this.vy += this.gravity; // Apply gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.alphaFactor;
        this.size -= this.scaleFactor;
    }

    display() {
        noStroke();
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
        drawStar(this.x, this.y, this.size, 5); // Draw a 5-pointed star
    }

    isOffScreen() {
        return this.alpha <= 0 || this.size < 0 || this.y > height; // Include condition for off the bottom of the screen
    }
}

function drawStar(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2;
    beginShape();
    for (let a = -PI/2; a < TWO_PI-PI/2; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * (radius / 2); // Adjust size of inner vertices
        sy = y + sin(a + halfAngle) * (radius / 2);
        vertex(sx, sy);
    }
    endShape(CLOSE);
}



class Card {

    /*
    * @param id - unique id of the card
    * @param posx - initial position of the card
    * @param posy - initial position of the card
    * @param disperseX - range (-1, 1)
    * @param disperseY - range (-1, 1)
     */
    constructor(id, posx, posy, disperseX, disperseY) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.width = 50;
        this.height = 100;

        this.initialPosY = posy;
        this.initialPosYAfterScatter = posy;
        this.initialPosX = posx;
        this.initialPosXAfterScatter = posx;
        this.initialized = false;
        this.dispersed = false;
        this.shouldBeReturned = false; // flag for controlling the return to initial position card animation.
        this.activePlaceholder = undefined; // id of the actively associated placeholder the card is on.
        this.animatedValueInitialization = -0.1; // helper for initialization animation.
        this.animatedValueDisperse = -0.1; // helper for disperse animation.
        this.rotationAngle = random(5, 25); // rotation of the card at the disperse action.
        this.rotationDirectionClockwise = random() > 0.5; // randomize the rotation direction.

        this.easeInFactorInitialization = 150; // how far the card moves at the initialization.

        // this.easeInFactorDisperse = random(-150, 150); // how far the card moves posX after disperse.
        // this.posyOffsetDisperse = random(-6, 6); // how far the card moves posY after disperse
        if (disperseX !== undefined && disperseY !== undefined){
            this.easeInFactorDisperse = map(disperseX, -1, 1, EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT, EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT); // how far the card moves posX after disperse.
            this.posyOffsetDisperse = map(disperseY, -1, 1, POSY_OFFSET_DISPERSE_LEFT_LIMIT, POSY_OFFSET_DISPERSE_RIGHT_LIMIT); // how far the card moves posY after disperse
        }

        this.currentRotationAngle = 0.01; // helper for disperse rotation animation.
        this.originalRotationAngle = 0.01; // helper to keep original rotation angle.
        this.scaleFactor = 1;
        this.ROTATION_ACCELERATION = 1.15; // rotation increment factor for animation.
    }

    initialize() {
        // animate card entering.
        if (!this.initialized) {
            this.animatedValueInitialization += 0.005;
            let easedValue = this.easeInOutQuint(this.animatedValueInitialization);
            this.posy = this.initialPosY - easedValue * this.easeInFactorInitialization;
            if (easedValue >= 1.0) {
                this.initialized = true;
                this.initialPosY = this.posy;
            }
        }
        this.draw();
    }


    disperse() {
        if (this.easeInFactorDisperse === undefined && this.posyOffsetDisperse === undefined){ // this is initial card.
            this.moveToStartingPoint();
        } else { // this is a normal card.
            this.scatter();
        }
    }

    // move card to starting position.
    moveToStartingPoint() {
        if (!this.dispersed) {
            this.animatedValueDisperse += 0.01;
            let easedValue = this.easeInOutQuint(this.animatedValueDisperse);

            this.posy = this.initialPosY - easedValue * (this.initialPosY - POSY_INITIAL_CARD);

            if (easedValue >= 1.0) { // finish disperse animation.
                this.dispersed = true;
            }
        }

        this.draw();
    }

    returnToScatteredPosition() {
        if (this.shouldBeReturned) {
            this.animatedValueDisperse += 0.01;
            let easedValue = this.easeInOutQuint(this.animatedValueDisperse);

            // modify posy only in the middle of the posx animation in order to avoid snappy behavior.
            // if (easedValue > 0.2 && easedValue < 0.8) {
            this.posy = POSY_INITIAL_CARD + easedValue * (this.initialPosYAfterScatter - POSY_INITIAL_CARD);
            // }

            // this.posx = this.initialPosX - easedValue * this.easeInFactorDisperse;

            if (easedValue >= 1.0) { // finish disperse animation.
                this.shouldBeReturned = false;
                this.animatedValueDisperse = -0.1; // reset to be used in subsequent returns.
            }
        }
        this.draw();
    }

    // "randomly" scatter the card.
    scatter() {
        if (!this.dispersed) {
            this.animatedValueDisperse += 0.01;
            let easedValue = this.easeInOutQuint(this.animatedValueDisperse);

            // modify posy only in the middle of the posx animation in order to avoid snappy behavior.
            if (easedValue > 0.2 && easedValue < 0.8) {
                this.posy = this.posy + (this.posyOffsetDisperse * (1 - easedValue));
            }

            this.posx = this.initialPosX - easedValue * this.easeInFactorDisperse;

            if (easedValue >= 1.0) { // finish disperse animation.
                this.dispersed = true;
                this.animatedValueDisperse = -0.1; // reset to be used in subsequent returns for returnToScatteredPosition().
            }
            this.initialPosYAfterScatter = this.posy;
            this.initialPosXAfterScatter = this.posx;
        }

        //------ ROTATION
        // rotate card during disperse animation.
        if (this.rotationDirectionClockwise) {
            if (this.currentRotationAngle < this.rotationAngle) {
                this.currentRotationAngle = this.currentRotationAngle * this.ROTATION_ACCELERATION;
            }
        } else {
            if (this.currentRotationAngle > this.rotationAngle * -1) {
                if (this.currentRotationAngle > 0) {
                    this.currentRotationAngle *= -1;
                }
                this.currentRotationAngle = this.currentRotationAngle * this.ROTATION_ACCELERATION;
            }
        }
        this.originalRotationAngle = this.currentRotationAngle;
        //---------------

        this.draw();
    }

    draw() {
        push();
        fill(255);
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        translate(this.posx, this.posy);

        // -------- scale image when active
        this.scaleImageWhenActive();
        //---------------

        // --------- straighten the card if there is any active placeholder
        this.processActivePlaceholder();
        // --------------

        scale(this.scaleFactor);
        rotate(radians(this.currentRotationAngle));
        rect(0, 0, this.width, this.height);
        fill(0);
        text(this.id, 0, 0);
        pop();
    }

    processActivePlaceholder() {
        if (this.activePlaceholder !== undefined) {
            this.resetRotation(true);

            // check if this is the currently selected card in which case do not snap as the user still drags it.
            if (!isAnySelectedCard()) {
                this.posx = this.activePlaceholder.posx;
                this.posy = this.activePlaceholder.posy;
            }
        } else {
            this.resetRotation(false);
        }
    }

    scaleImageWhenActive() {
        if (this.isActive(touchTargets[0].x, touchTargets[0].y)) {
            if (this.scaleFactor < 2) {
                this.scaleFactor += 0.1;
            }
        } else {
            if (this.scaleFactor > 1) {
                this.scaleFactor -= 0.1;
            }
        }
    }

// check if mouse given positions are within the drawing dimensions of the card.
    isActive(positionX, positionY) {
        if(mouseIsPressed && (positionX > this.posx-(this.width/2) && positionX < this.posx+(this.width/2))
            && (positionY > this.posy-(this.height/2) && positionY < this.posy+(this.height/2))){
            return true;
        } else {
            return false;
        }
    }

    isFirstCard() {
        return this.easeInFactorDisperse === undefined && this.posyOffsetDisperse === undefined;
    }

    resetRotation(isStraight) {
        if (isStraight) {
            this.currentRotationAngle = 0;
        } else {
            this.currentRotationAngle = this.originalRotationAngle;
        }
    }

    easeInOutQuint(progress) {
        if (progress < 0.5) {
            return 16 * Math.pow(progress, 5);
        } else {
            return 1 - Math.pow(-2 * progress + 2, 5) / 2;
        }
    }

    easeOutQuad(progress) {
        return 1 - (1 - progress) * (1 - progress);
    }

}

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