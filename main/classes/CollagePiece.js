class CollagePiece {

    /*
    * @param id - unique id of the card
    * @param posx - initial position of the card
    * @param posy - initial position of the card
    * @param disperseX - range (-1, 1)
    * @param disperseY - range (-1, 1)
     */
    constructor(id, posx, posy, width, height) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;

        this.cardImage = loadImage('../collageImg/pieces/' + this.id + '.png');

        this.initialPosY = posy;
        this.initialPosYAfterScatter = posy;
        this.initialPosX = posx;
        this.initialized = false;
        this.dispersed = false;
        this.shouldBeReturned = false; // flag for controlling the return to initial position card animation.
        this.activePlaceholder = undefined; // id of the actively associated placeholder the card is on.
        this.animatedValueInitialization = -0.1; // helper for initialization animation.
        this.animatedValueDisperse = -0.1; // helper for disperse animation.
        this.rotationAngle = random(5, 25); // rotation of the card at the disperse action.
        this.rotationDirectionClockwise = random() > 0.5; // randomize the rotation direction.

        this.currentRotationAngle = 0.01; // helper for disperse rotation animation.
        this.originalRotationAngle = 0.01; // helper to keep original rotation angle.
        this.scaleFactor = 1;
        this.ROTATION_ACCELERATION = 1.15; // rotation increment factor for animation.
    }

    draw() {
        push();

        fill(255);
        stroke(1);
        strokeWeight(1);
        rectMode(CENTER);
        translate(this.posx, this.posy);

        scale(this.scaleFactor);
        rotate(radians(this.currentRotationAngle));
        image(this.cardImage, -this.width/2, -this.height/2);

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

    resetRotation(isStraight) {
        if (isStraight) {
            this.currentRotationAngle = 0;
        } else {
            this.currentRotationAngle = this.originalRotationAngle;
        }
    }

}