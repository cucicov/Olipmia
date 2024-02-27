
class Button {
    constructor(posx, posy, width, height) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.isVisible = false;
        this.text = ">";
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
            text(this.text, 0, 0);
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
