class Icon {

    /*
    * @param id - unique id of the card
    * @param posx - initial position of the card
    * @param posy - initial position of the card
    * @param disperseX - range (-1, 1)
    * @param disperseY - range (-1, 1)
     */
    constructor(id, posx, posy, disperseX, disperseY, gameProp) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.width = 150;
        this.height = 150;

        this.iconImage = loadImage('../memoryImg/icons/' + this.id + '.png');
        this.iconErrImage = loadImage('../memoryImg/icons/' + this.id + '_err.png');
        this.iconWinImage = loadImage('../memoryImg/icons/' + this.id + '_win.png');

        this.initialPosX = posx;
        this.initialPosY = posy;

        this.dispersed = false;
        this.animatedValueDisperse = -0.1; // helper for disperse animation.

        this.easeInFactorDisperse = map(disperseX, -1, 1, gameProp.EASE_IN_FACTOR_DISPERSE_LEFT_LIMIT, gameProp.EASE_IN_FACTOR_DISPERSE_RIGHT_LIMIT); // how far the card moves posX after disperse.
        this.posyOffsetDisperse = map(disperseY, -1, 1, gameProp.POSY_OFFSET_DISPERSE_LEFT_LIMIT, gameProp.POSY_OFFSET_DISPERSE_RIGHT_LIMIT); // how far the card moves posY after disperse

        this.wrongIconSelected = false;
        this.correctIconSelected = false;
        this.scaleFactor = 1;

        this.gameProp = gameProp;
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
        imageMode(CENTER);
        translate(this.posx, this.posy);
        scale(this.scaleFactor);

        // check if wrong card is selected
        if (this.wrongIconSelected) {
            this.scaleFactor -= 0.03;
            fill(220, 0, 0);
            image(this.iconErrImage, 0, 0);
        } else if (this.correctIconSelected && !this.gameProp.gameState.isLost) {
            fill(255);
            image(this.iconWinImage, 0, 0);
        } else {
            fill(255);
            image(this.iconImage, 0, 0);
        }
        // rect(0, 0, this.width, this.height);
        // fill(255);
        // text(this.id, 0, 0);
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