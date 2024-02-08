

//TODO: organize variables
let fps = 0;
let persistentErrors = 0;
let historyErrors = 0;

let img;
let crop;
let maskImg;
let icons = [];
let originalNumberOfIcons; // used in error calculation.

let nextButton;

let gameState = {
    isLevelOver: false,
    isWon: false,
    isLost: false,
    isGameOver: false,
}

let levelNumber = 1;


//TODO: extract all there common variables in a separate commons JS.
// ----- STARS VARIABLES -----
const STAR_ROTATION_SPEED = 0.01;
const STAR_RADIUS = 145;
let startRotationParam = 0;
// -------------------------------


//TODO: extract all there common variables in a separate commons JS.
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

//TODO: extract all there common variables in a separate commons JS.
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


// levels of error // TODO: refactor intro properties?
let ERRORS_LEVEL_1 = 2; // reveal first layer
let ERRORS_LEVEL_2 = 3; // reveal whole image
let ERRORS_LEVEL_3 = 4; // game over

let images = [];

const EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT = -500;
const EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT = 500;

// this controls the limits within which cards can move on posY
const POSY_OFFSET_DISPERSE_LEFT_LIMIT = -50;
const POSY_OFFSET_DISPERSE_RIGHT_LIMIT = 50;


let iconMatchProperties = {
    WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
    particles: [], // list of particles for card match animation.
    shouldDisplay: false,
    placeholder: -1, // placeholder to use in positioning card match animation.
    particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
    numberOfParticles: 15, // number of particles.
}


function preload() {
    images.push(loadImage('img/1.jpg'))
    images.push(loadImage('img/2.jpg'))
    images.push(loadImage('img/3.jpg'))
}

function setup() {
    createCanvas(2160, 3840);

    initializeNewImage();
    initializeIcons();
}

function removeRemainingWrongIcons() {
    for (let i = 0; i < icons.length; i++) {
        if (icons[i].id !== maskImg.associatedId) {
            icons[i].wrongIconSelection();
        }
    }
}

// calculate number of errors, display additional image levels as errors increase, display next
function processErrors() {
    if (!gameState.isLevelOver && !gameState.isGameOver) {
        historyErrors = originalNumberOfIcons - icons.length;
        maskImg.zoomLevel = historyErrors;

        // if minimum numbers of icons are left -> game over and remove all other icons.
        // this also checks if last wrong icon finished animation.
        if (historyErrors >= ERRORS_LEVEL_3 && icons.length <= originalNumberOfIcons - ERRORS_LEVEL_3) {
            removeRemainingWrongIcons();
        }

        // process when game is over for current image
        if (icons.length === 1) {
            gameState.isLevelOver = true;
            gameState.isLost = true;
        }

        if (levelNumber > 5) {
            gameState.isGameOver = true;
        }
    }
}

// removes icons that have been zoomed out.
function removeInvisibleIcons() {
    for (let i = 0; i < icons.length; i++) {
        if (icons[i].scaleFactor < 0) {
            icons.splice(i, 1);
            break;
        }
    }
}

function resetNewGame() {
    initializeNewImage();
    persistentErrors += historyErrors; // preserve history errors from previous level.
    icons = [];

    initializeIcons();
    initHidePopUp();

    gameState.isLevelOver = false;
    gameState.isWon = false;
    gameState.isLost = false;
    gameState.isLevelOver = false;

    levelNumber++;
}

function draw() {
    background(220);

    // guiding lines center of the screen.
    line(0, 840, width, 840);
    line(0, height-840, width, height-840);

    generateMatchParticles();

    if (!gameState.isGameOver) {
        maskImg.draw();

        // icons display and click logic.
        for (let i = 0; i < icons.length; i++) {
            let currentIcon = icons[i];
            currentIcon.disperse();
            currentIcon.draw();

            if (currentIcon.isActive(mouseX, mouseY)) {
                if (maskImg.associatedId === currentIcon.id){ // correct icon selected.
                    if (!currentIcon.correctIconSelected) {
                        currentIcon.correctIconSelection();
                        initDisplayMatchAnimation(currentIcon);
                        initShowPopUp();

                        gameState.isWon = true;
                        gameState.isLevelOver = true;
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
    if (gameState.isLevelOver) {
        initShowPopUp();
        removeRemainingWrongIcons();

        maskImg.zoomLevel = ERRORS_LEVEL_3; // display whole image.

        if (gameState.isGameOver) {
            nextButton.isVisible = false;
            infoPopUpProperties.displayPopUp = true;
        } else {
            nextButton.isVisible = true;
            if (nextButton.isClicked(mouseX, mouseY)) {
                resetNewGame();
            }
        }

    }
    nextButton.draw();

    // DEBUG - display FPS
    if (random() > 0.9) {
        fps = (fps + frameRate())/2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + fps.toFixed(0), 20, 20);
    text("ERRORS: " + persistentErrors, 20, 40);

    if (gameState.isGameOver) {
        initShowInfoPopUp();
    }

    drawInfoPopUp(width/2, height/2);

    drawPopUp();
}

function mousePressed() {
    checkInfoPopUpClosed();
    initHidePopUp();
}

function checkInfoPopUpClosed() {
    if (mouseX > 1680 && mouseX < 1730 && mouseY < 1400 && mouseY > 1340) {
        initHideInfoPopUp();

        // workaround to not display final pop up anymore.
        infoPopUpProperties.showPropertiesInitialized = true;
    }
}


//TODO: extract all there common variables in a separate commons JS.
function drawPopUp() {
    if (cardPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(cardPopUpProperties);

        push();
        noStroke();
        fill(255);
        translate(width/2, height/2 + 800);
        scale(scaleRatio * 2);
        rectMode(CENTER);
        rect(0, 0, 1200, 500, 30);
        pop();

        if (scaleRatio === 0) {
            cardPopUpProperties.displayPopUp = false;
        }
    }
}

//TODO: extract all there common variables in a separate commons JS.
function initShowPopUp(placeholder) {
    if (!cardPopUpProperties.showPropertiesInitialized) {

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

//TODO: extract all there common variables in a separate commons JS.
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

function drawInfoPopUp(posx, posy) {
    if (infoPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(infoPopUpProperties);

        push();
        noStroke();
        fill(255);
        translate(posx, posy);
        scale(scaleRatio);
        rectMode(CENTER);
        rect(0, 0, 2800, 2500, 70);
        stroke(1);
        strokeWeight(7);

        // X
        line(1200, -1150, 1300, -1050);
        line(1200, -1050, 1300, -1150);

        // stars

        let {star1Win, star2Win, star3Win} = getWinStarSettings();
        drawRotatingStar(0 - 400, 0 - 880, star1Win);
        drawRotatingStar(0, 0 - 880, star2Win);
        drawRotatingStar(0 + 400, 0 - 880, star3Win);

        pop();

        if (scaleRatio === 0) {
            infoPopUpProperties.displayPopUp = false;
        }

    }
}

//TODO: extract all there common variables in a separate commons JS.
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

//TODO: extract all there common variables in a separate commons JS.
function getWinStarSettings() {
    let star1Win = persistentErrors < 10;
    let star2Win = persistentErrors < 5;
    let star3Win = persistentErrors < 3;
    return {star1Win, star2Win, star3Win};
}


//TODO: extract all there common variables in a separate commons JS.
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

function initializeNewImage() {
    let img = random(images);

    let cropSize1 = 300;
    let crop1 = new CropSettings(cropSize1, cropSize1, img.width / 2 - cropSize1 / 2, img.height / 2 - cropSize1 / 2);
    let cropSize2 = 600;
    let crop2 = new CropSettings(cropSize2, cropSize2, img.width / 2 - cropSize2 / 2, img.height / 2 - cropSize2 / 2);
    let cropSize3 = 1800; // whole image reveal
    let crop3 = new CropSettings(cropSize3, cropSize3, img.width / 2 - cropSize3 / 2, img.height / 2 - cropSize3 / 2);

    maskImg = new MaskImage(img, 2, crop1, crop2, crop3);

    nextButton = new Button(width - 100, height/2, 50, 50);
}

function initializeIcons() {
    icons.push(new Icon(1, (width / 2), height / 2, 1, -0.33));
    icons.push(new Icon(2, (width / 2), height / 2, -1, -0.33));
    icons.push(new Icon(3, width / 2, height / 2, 0.33, -1));
    icons.push(new Icon(4, (width / 2), height / 2, 0.33, 1));
    icons.push(new Icon(5, (width / 2), height / 2, -0.33, -1));
    icons.push(new Icon(6, (width / 2), height / 2, -0.33, 1));
    icons.push(new Icon(7, (width / 2), height / 2, 1, 0.33));
    icons.push(new Icon(8, (width / 2), height / 2, -1, 0.33));

    originalNumberOfIcons = icons.length;
}


class Particle {
    constructor(x, y, multicolor) {
        this.x = x;
        this.y = y;
        this.alpha = 255;
        if (multicolor) {
            this.color = color(random(0, 120), random(80, 220), random(180, 255));
            this.vx = random(-17, 17);
            this.vy = random(-17, 17);
            this.scaleFactor = 0.01;
            this.size = random(10, 50);
            this.alphaFactor = 3;
            this.gravity = 0; // Gravity force
        } else {
            this.color = color(random([[255, 236, 139], [255, 215, 0], [184, 134, 11], [218, 165, 32], [238, 232, 170]]));
            this.vx = random(-15, 15);
            this.vy = random(-15, 15);
            this.scaleFactor = 0.5;
            this.size = random(10, 50);
            this.alphaFactor = 3;
            this.gravity = 0.07; // Gravity force
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
        // fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
        fill(255);
        stroke(0);
        strokeWeight(1);
        // ellipse(this.x, this.y, random(5,10), random(5,10));
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

class CropSettings {
    constructor(cropWidth, cropHeight, sourceCropX, sourceCropY) {
        this.cropWidth = cropWidth;
        this.cropHeight = cropHeight;
        this.sourceCropX = sourceCropX;
        this.sourceCropY = sourceCropY;
    }
}

class MaskImage {
    /*
    * @param image - image of the sports person.
    * @param sportId - correct associated sport id.
    * @param crop1 - initial size of the crop image.
    * @param crop2 - level 2 of the crop image.
    * @param crop3 - level 3 of the crop image.
     */
    constructor(image, sportId, crop1, crop2, crop3) {
        this.image = image;
        this.associatedId = sportId;

        this.cropWidth = crop1.cropWidth;
        this.cropHeight = crop1.cropHeight;
        this.sourceCropX = crop1.sourceCropX;
        this.sourceCropY = crop1.sourceCropY;

        this.crop2Settings = crop2;
        this.crop3Settings = crop3;

        this.zoomStep = 5;
        this.zoomLevel = 1;
    }

    draw() {

        this.checkZoom();

        this.posx = width/2 - (this.cropWidth/2);
        this.posy = height/2 - (this.cropHeight/2);

        image(this.image, this.posx, this.posy, this.cropWidth,
            this.cropHeight, this.sourceCropX, this.sourceCropY,
            this.cropWidth, this.cropHeight);
    }

    // check if reveal should be done and update settings accordingly.
    checkZoom() {
        if (this.zoomLevel === ERRORS_LEVEL_1) {
            if (this.cropWidth < this.crop2Settings.cropWidth) {
                this.cropWidth += this.zoomStep;
            }
            if (this.cropHeight < this.crop2Settings.cropHeight) {
                this.cropHeight += this.zoomStep;
            }
            if (this.sourceCropX > this.crop2Settings.sourceCropX) {
                this.sourceCropX -= this.zoomStep / 2;
            }
            if (this.sourceCropY > this.crop2Settings.sourceCropY) {
                this.sourceCropY -= this.zoomStep / 2;
            }
        }

        if (this.zoomLevel >= ERRORS_LEVEL_2) {
            if (this.cropWidth < this.crop3Settings.cropWidth) {
                this.cropWidth += this.zoomStep;
            }
            if (this.cropHeight < this.crop3Settings.cropHeight) {
                this.cropHeight += this.zoomStep;
            }
            if (this.sourceCropX > this.crop3Settings.sourceCropX) {
                this.sourceCropX -= this.zoomStep / 2;
            }
            if (this.sourceCropY > this.crop3Settings.sourceCropY) {
                this.sourceCropY -= this.zoomStep / 2;
            }
        }
    }
}

function initDisplayMatchAnimation(icon) {
    iconMatchProperties.shouldDisplay = true;
    iconMatchProperties.placeholder = icon;
    iconMatchProperties.particleAnimationDuration = iconMatchProperties.WIN_PARTICLE_ANIMATION_DURATION;
}

function generateMatchParticles() {
    if (iconMatchProperties.shouldDisplay) {
        iconMatchProperties.particleAnimationDuration--;
        for (let i = 0; i < iconMatchProperties.numberOfParticles; i++) {
            let particle = new Particle(iconMatchProperties.placeholder.posx, iconMatchProperties.placeholder.posy);
            iconMatchProperties.particles.push(particle);
        }

        if (iconMatchProperties.particleAnimationDuration < 0) {
            iconMatchProperties.shouldDisplay = false;
        }
    }

    // Update and display each particle
    for (let i = iconMatchProperties.particles.length - 1; i >= 0; i--) {
        iconMatchProperties.particles[i].update();
        iconMatchProperties.particles[i].display();

        // Remove particles that are no longer visible
        if (iconMatchProperties.particles[i].isOffScreen()) {
            iconMatchProperties.particles.splice(i, 1);
        }
    }
}

class Button {
    constructor(posx, posy, width, height) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.isVisible = false;
    }

    draw() {
        if (this.isVisible) {
            push();
            fill(255);
            stroke(1);
            strokeWeight(1);
            rectMode(CENTER);
            translate(this.posx, this.posy);
            rect(0, 0, this.width, this.height);
            fill(0);
            text(">", 0, 0);
            pop();
        }
    }

    isClicked(positionX, positionY) {
        if(mouseIsPressed && (positionX > this.posx-(this.width/2) && positionX < this.posx+(this.width/2))
            && (positionY > this.posy-(this.height/2) && positionY < this.posy+(this.height/2))){
            return true;
        } else {
            return false;
        }
    }
}

class Icon {

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
        this.width = 150;
        this.height = 150;

        this.initialPosX = posx;
        this.initialPosY = posy;

        this.dispersed = false;
        this.animatedValueDisperse = -0.1; // helper for disperse animation.

        this.easeInFactorDisperse = map(disperseX, -1, 1, EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT, EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT); // how far the card moves posX after disperse.
        this.posyOffsetDisperse = map(disperseY, -1, 1, POSY_OFFSET_DISPERSE_LEFT_LIMIT, POSY_OFFSET_DISPERSE_RIGHT_LIMIT); // how far the card moves posY after disperse

        this.wrongIconSelected = false;
        this.correctIconSelected = false;
        this.scaleFactor = 1;
    }

    // "randomly" scatter the card.
    disperse() {
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
        }
    }

    draw() {
        push();
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        translate(this.posx, this.posy);

        // check if wrong card is selected
        if (this.wrongIconSelected) {
            this.scaleFactor -= 0.03;
            fill(220, 0, 0);
        } else {
            fill(255);
        }
        scale(this.scaleFactor);
        rect(0, 0, this.width, this.height);
        fill(0);
        text(this.id, 0, 0);
        pop();
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

    correctIconSelection() {
        this.correctIconSelected = true;
    }

    wrongIconSelection() {
        this.wrongIconSelected = true;
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

