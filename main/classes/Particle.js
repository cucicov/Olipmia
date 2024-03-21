class Particle {
    constructor(x, y, multicolor) {
        this.x = x;
        this.y = y;
        this.alpha = 255;
        if (multicolor) {
            this.color = color(random(0, 120), random(80, 220), random(180, 255));
            this.vx = random(-25, 25);
            this.vy = random(-25, 25);
            this.scaleFactor = 0.1;
            this.size = random(10, 50);
            this.alphaFactor = 3;
            this.gravity = 0; // Gravity force
        } else {
            this.color = color(random([[255, 236, 139], [255, 215, 0], [184, 134, 11], [218, 165, 32], [238, 232, 170]]));
            this.vx = random(-25, 25);
            this.vy = random(-25, 25);
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
        fill(255, 255, 255, this.alpha);
        // fill(255);
        stroke(0);
        strokeWeight(1);
        // ellipse(this.x, this.y, random(5,10), random(5,10));
        drawStar(this.x, this.y, this.size, 5); // Draw a 5-pointed star
    }

    isOffScreen() {
        return this.size < 0 || this.y > height; // Include condition for off the bottom of the screen
    }
}