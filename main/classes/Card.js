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
        this.width = tl.CARD_WIDTH;
        this.height = tl.CARD_HEIGHT;

        if (language === LANG_RO) {
            this.cardImage = loadImage('../timelineImg/' + this.id + '.png');
        } else if (language === LANG_EN) {
            this.cardImage = loadImage('../timelineImg/en/' + this.id + '.png');
        }

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

        this.easeInFactorInitialization = tl.POSY_INITIAL_DECK; // how far the card moves at the initialization.

        // this.easeInFactorDisperse = random(-150, 150); // how far the card moves posX after disperse.
        // this.posyOffsetDisperse = random(-6, 6); // how far the card moves posY after disperse
        if (disperseX !== undefined && disperseY !== undefined){
            this.easeInFactorDisperse = map(disperseX, -1, 1, tl.EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT, tl.EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT); // how far the card moves posX after disperse.
            this.posyOffsetDisperse = map(disperseY, -1, 1, tl.POSY_OFFSET_DISPERSE_LEFT_LIMIT, tl.POSY_OFFSET_DISPERSE_RIGHT_LIMIT); // how far the card moves posY after disperse
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

            this.posy = this.initialPosY - easedValue * (this.initialPosY - tl.POSY_INITIAL_CARD);

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
            this.posy = tl.POSY_INITIAL_CARD + easedValue * (this.initialPosYAfterScatter - tl.POSY_INITIAL_CARD);
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
        image(this.cardImage, -this.width/2, -this.height/2);
        // rect(0, 0, this.width, this.height);
        // fill(0);
        // textSize(44);
        // text(this.id, 0, 0);
        pop();
    }

    processActivePlaceholder() {
        if (this.activePlaceholder !== undefined) {
            this.resetRotation(true);

            // check if this is the currently selected card in which case do not snap as the user still drags it.
            if (!isAnySelectedCard()) {
                this.posx = this.activePlaceholder.posx;
                this.posy = this.activePlaceholder.posy+30; // +30 to compensate for the unknown offset.
            }
        } else {
            this.resetRotation(false);
        }
    }

    scaleImageWhenActive() {
        if (this.isActive(touchTargets[0].x, touchTargets[0].y)) {
            if (this.scaleFactor < 1.4) {
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