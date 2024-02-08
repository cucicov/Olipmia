
function getWinStarSettings(gameProp) {
    let star1Win = tl.historyErrors < 10;
    let star2Win = tl.historyErrors < 3;
    let star3Win = tl.historyErrors === 0;
    return {star1Win, star2Win, star3Win};
}


function drawWinStars(gameProp) {
    if (!gameProp.infoPopUpProperties.displayPopUp) {
        let {star1Win, star2Win, star3Win} = getWinStarSettings(gameProp);
        drawRotatingStar(width/2 - 400, height/2 + 100, star1Win, gameProp);
        drawRotatingStar(width/2, height/2 + 100, star2Win, gameProp);
        drawRotatingStar(width/2 + 400, height/2 + 100, star3Win, gameProp);
    }
}


function drawRotatingStar(posx, posy, isWinStart, gameProp) {
    gameProp.startRotationParam += gameProp.STAR_ROTATION_SPEED;

    if (isWinStart) {
        fill(255, 215, 0);
    } else {
        fill(120,120,120);
    }

    noStroke();
    beginShape();
    vertex(posx + gameProp.STAR_RADIUS * cos(TWO_PI * 0/5 + gameProp.startRotationParam),
        posy + gameProp.STAR_RADIUS * sin(TWO_PI * 0/5 + gameProp.startRotationParam));
    vertex(posx + gameProp.STAR_RADIUS * cos(TWO_PI * 2/5 + gameProp.startRotationParam),
        posy +gameProp. STAR_RADIUS * sin(TWO_PI * 2/5 + gameProp.startRotationParam));
    vertex(posx + gameProp.STAR_RADIUS * cos(TWO_PI * 4/5 + gameProp.startRotationParam),
        posy + gameProp.STAR_RADIUS * sin(TWO_PI * 4/5 + gameProp.startRotationParam));
    vertex(posx + gameProp.STAR_RADIUS * cos(TWO_PI * 1/5 + gameProp.startRotationParam),
        posy + gameProp.STAR_RADIUS * sin(TWO_PI * 1/5 + gameProp.startRotationParam));
    vertex(posx + gameProp.STAR_RADIUS * cos(TWO_PI * 3/5 + gameProp.startRotationParam),
        posy + gameProp.STAR_RADIUS * sin(TWO_PI * 3/5 + gameProp.startRotationParam));
    endShape(CLOSE);
}


function initDisplayMatchAnimation(placeholder, gameProp) {
    gameProp.cardMatchProperties.shouldDisplay = true;
    gameProp.cardMatchProperties.placeholder = placeholder;
    gameProp.cardMatchProperties.particleAnimationDuration = gameProp.cardMatchProperties.WIN_PARTICLE_ANIMATION_DURATION;
}



function generateMatchParticles(gameProp) {
    if (gameProp.cardMatchProperties.shouldDisplay) {
        gameProp.cardMatchProperties.particleAnimationDuration--;
        for (let i = 0; i < gameProp.cardMatchProperties.numberOfParticles; i++) {
            let particle = new Particle(gameProp.cardMatchProperties.placeholder.posx, gameProp.cardMatchProperties.placeholder.posy);
            gameProp.cardMatchProperties.particles.push(particle);
        }

        if (gameProp.cardMatchProperties.particleAnimationDuration < 0) {
            gameProp.cardMatchProperties.shouldDisplay = false;
        }
    }

    // Update and display each particle
    for (let i = gameProp.cardMatchProperties.particles.length - 1; i >= 0; i--) {
        gameProp.cardMatchProperties.particles[i].update();
        gameProp.cardMatchProperties.particles[i].display();

        // Remove particles that are no longer visible
        if (gameProp.cardMatchProperties.particles[i].isOffScreen()) {
            gameProp.cardMatchProperties.particles.splice(i, 1);
        }
    }
}


function createFinalWinParticlesAnimation(posx, finalPosx, gameProp) {
    if (posx < finalPosx) {
        for (let i = 0; i < 1; i++) {
            let particle = new Particle(posx, gameProp.winProperties.posy, true);
            gameProp.winProperties.particles.push(particle);
        }
    }

    // Update and display each particle
    for (let i = gameProp.winProperties.particles.length - 1; i >= 0; i--) {
        gameProp.winProperties.particles[i].update();
        gameProp.winProperties.particles[i].display();

        // Remove particles that are no longer visible
        if (gameProp.winProperties.particles[i].isOffScreen()) {
            gameProp.winProperties.particles.splice(i, 1);
        }
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