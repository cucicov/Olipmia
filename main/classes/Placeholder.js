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
    constructor(id, posx, posy, width, height, cardId, year, info, gameProp) {
        this.id = id;
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.correctCardId = cardId; // correct card id.
        this.gameProp = gameProp;
        if (gameProp.propertiesIdentifier === "tl") {
            if (language === LANG_RO) {
                this.correctCardDetailsImage = loadImage('../timelineImg/' + this.correctCardId + '_details.png');
            } else if (language === LANG_EN) {
                this.correctCardDetailsImage = loadImage('../timelineImg/en/' + this.correctCardId + '_details.png');
            }
            this.placeholderImage = loadImage('../timelineImg/placeholder.png');
        }

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

        if (this.gameProp.propertiesIdentifier === puz.propertiesIdentifier) {
            push();
            rectMode(CENTER);
            // stroke(this.phStroke);
            // strokeWeight(this.phStroke);
            stroke('#CACACA');
            fill('#F0F0F0');
            // fill(this.rectColorR, this.rectColorG, this.rectColorB);
            rect(this.posx, this.posy, this.width, this.height);
            pop();
        }

        if (this.gameProp.propertiesIdentifier === tl.propertiesIdentifier) {
            push();
            imageMode(CENTER);

            image(this.placeholderImage, this.posx, this.posy);
            pop();
        }
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