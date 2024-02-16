

//TODO: organize variables
let fps = 0;
let persistentErrors = 0;
let historyErrors = 0;

let mem = {
    propertiesIdentifier: "mem",
    maskImg: undefined,
    icons: [],
    images: [],

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



    cardMatchProperties: {
        WIN_PARTICLE_ANIMATION_DURATION: 2, // duration for generating particles.
        particles: [], // list of particles for card match animation.
        shouldDisplay: false,
        particleAnimationDuration: this.WIN_PARTICLE_ANIMATION_DURATION,
        numberOfParticles: 15, // number of particles.
        placeholder: undefined,
    }

}


function preload() {
    mem.images.push(loadImage('img/1.jpg'))
    mem.images.push(loadImage('img/2.jpg'))
    mem.images.push(loadImage('img/3.jpg'))
}

function initializeMemory() {
    createCanvas(2160, 3840);

    initializeNewImage();
    initializeIcons();
}

function setup() {
    initializeMemory();
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
        historyErrors = mem.gameState.originalNumberOfIcons - mem.icons.length;
        mem.maskImg.zoomLevel = historyErrors;

        // if minimum numbers of icons are left -> game over and remove all other icons.
        // this also checks if last wrong icon finished animation.
        if (historyErrors >= mem.ERRORS_LEVEL_3 && mem.icons.length <= mem.gameState.originalNumberOfIcons - mem.ERRORS_LEVEL_3) {
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
    persistentErrors += historyErrors; // preserve history errors from previous level.
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
        fps = (fps + frameRate()) / 2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + fps.toFixed(0), 20, 20);
    text("ERRORS: " + persistentErrors, 20, 40);

    if (mem.gameState.isGameOver) {
        initShowInfoPopUp(mem);
    }

    drawInfoPopUp(width / 2, height / 2, mem);

    drawPopUp(mem);
    // print('popup:' + mem.cardMatchProperties.placeholder.posx + ':' + mem.cardMatchProperties.placeholder.posy);
}

function draw() {
    drawMemory();

}

function mousePressed() {
    checkInfoPopUpClosed(mem);
    initHidePopUp(mem);
}


function initializeNewImage() {
    let img = random(mem.images);

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
