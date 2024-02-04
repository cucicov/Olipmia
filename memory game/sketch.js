

//TODO: organize variables
let fps = 0;
let persistentErrors = 0;
let historyErrors = 0;

let img;
let crop;
let maskImg;
let icons = [];

let images = [];

const EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT = -200;
const EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT = 200;

// this controls the limits within which cards can move on posY
const POSY_OFFSET_DISPERSE_LEFT_LIMIT = -20;
const POSY_OFFSET_DISPERSE_RIGHT_LIMIT = 20;



function preload() {
    images.push(loadImage('img/1.jpg'))
    images.push(loadImage('img/2.jpg'))
    images.push(loadImage('img/3.jpg'))
}

function setup() {
    createCanvas(1000, 1000);

    initializeNewImage();
    initializeIcons();
}

function draw() {
    background(220);

    maskImg.draw();

    for(let i=0; i<icons.length; i++) {
        let currentIcon = icons[i];
        currentIcon.disperse();
        currentIcon.draw();

        if (currentIcon.isActive(mouseX, mouseY)) {
            print(currentIcon.id);
        }
    }

    if (maskImg.zoomLevel > 3) {
        initializeNewImage();
        icons = [];
        initializeIcons();
    }

    // DEBUG - display FPS
    if (random() > 0.9) {
        fps = (fps + frameRate())/2; // Get the current frames per second
    }
    textSize(16);
    fill(0);
    text("FPS: " + fps.toFixed(0), 20, 20);
    text("ERRORS: " + historyErrors, 20, 40);

}

function mouseClicked() {
    maskImg.zoomLevel++;
}



function initializeNewImage() {
    let img = random(images);

    let cropSize1 = 100;
    let crop1 = new CropSettings(cropSize1, cropSize1, img.width / 2 - cropSize1 / 2, img.height / 2 - cropSize1 / 2);
    let cropSize2 = 200;
    let crop2 = new CropSettings(cropSize2, cropSize2, img.width / 2 - cropSize2 / 2, img.height / 2 - cropSize2 / 2);
    let cropSize3 = 800;
    let crop3 = new CropSettings(cropSize3, cropSize3, img.width / 2 - cropSize3 / 2, img.height / 2 - cropSize3 / 2);

    maskImg = new MaskImage(img, 2, crop1, crop2, crop3);
}

function initializeIcons() {
    icons.push(new Icon(1, (width / 2), height / 2, 1, 0));
    icons.push(new Icon(2, (width / 2), height / 2, -1, 0));
    icons.push(new Icon(3, width / 2, height / 2, 0.33, -1));
    icons.push(new Icon(4, (width / 2), height / 2, 0.33, 1));
    icons.push(new Icon(5, (width / 2), height / 2, -0.33, -1));
    icons.push(new Icon(6, (width / 2), height / 2, -0.33, 1));
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

        this.zoomStep = 2;
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
        if (this.zoomLevel === 2) {
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

        if (this.zoomLevel > 2) {
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
        this.width = 50;
        this.height = 50;

        this.initialPosX = posx;
        this.initialPosY = posy;

        this.dispersed = false;
        this.animatedValueDisperse = -0.1; // helper for disperse animation.

        this.easeInFactorDisperse = map(disperseX, -1, 1, EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT, EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT); // how far the card moves posX after disperse.
        this.posyOffsetDisperse = map(disperseY, -1, 1, POSY_OFFSET_DISPERSE_LEFT_LIMIT, POSY_OFFSET_DISPERSE_RIGHT_LIMIT); // how far the card moves posY after disperse
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
        fill(255);
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        translate(this.posx, this.posy);

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

