
function getWinStarSettings(gameProp) {
    let star1Win = false;
    let star2Win = false;
    let star3Win = false;
    if (gameProp.propertiesIdentifier === "tl") {
        // star1Win = tl.historyErrors < gameProp.ERRORS_1_STARS;
        star1Win = true; // always win 1 star.
        star2Win = tl.historyErrors < gameProp.ERRORS_2_STARS;
        star3Win = tl.historyErrors < gameProp.ERRORS_3_STARS;
    }
    if (gameProp.propertiesIdentifier === "mem") {
        star1Win = mem.persistentErrors < gameProp.ERRORS_1_STARS;
        star2Win = mem.persistentErrors < gameProp.ERRORS_2_STARS;
        star3Win = mem.persistentErrors < gameProp.ERRORS_3_STARS;
    }
    return {star1Win, star2Win, star3Win};
}


function drawWinStars(gameProp) {
    // if (!gameProp.infoPopUpProperties.displayPopUp) {
        let {star1Win, star2Win, star3Win} = getWinStarSettings(gameProp);

        // start decreasing stars timeouts.
        gameProp.timeoutStar1--;
        gameProp.timeoutStar2--;
        gameProp.timeoutStar3--;
        gameProp.timeoutStarText--;

        if (gameProp.timeoutStar1 < 0) {
            drawRotatingStar(width/2 - 300, height/2 - 100 + 5, star1Win, gameProp, true); // shadow
            drawRotatingStar(width/2 - 300, height/2 - 100, star1Win, gameProp);
        }
        if (gameProp.timeoutStar2 < 0) {
            drawRotatingStar(width / 2, height / 2 - 200 + 5, star2Win, gameProp, true); // shadow
            drawRotatingStar(width / 2, height / 2 - 200, star2Win, gameProp);
        }
        if (gameProp.timeoutStar3 < 0) {
            drawRotatingStar(width / 2 + 300, height / 2 - 100 + 5, star3Win, gameProp, true); // shadow
            drawRotatingStar(width / 2 + 300, height / 2 - 100, star3Win, gameProp);
        }

        // DRAW STAR TEXT..................
        if (gameProp.timeoutStarText < 0) {
            push();
            // draw text
            if (star1Win && star2Win && star3Win) { // 3 STAR
                textSize(46);
                fill(0);
                textFont(fontNotoMedium);
                textStyle(BOLD);
                textAlign(CENTER);
                if (language === LANG_RO) {
                    text("Legendar!", width / 2, height / 2 + 100);
                } else if (language === LANG_EN) {
                    text("Legend!", width / 2, height / 2 + 100);
                }
                textFont(fontNotoLight);
                textStyle(NORMAL);
                if (language === LANG_RO) {
                    text("Performanța ta a fost la un\n nivel istoric!", width / 2, height / 2 + 200);
                } else if (language === LANG_EN) {
                    text("You’ve had\na historic performance!", width / 2, height / 2 + 200);
                }
            }
            if (star1Win && star2Win && !star3Win) { // 2 STAR
                textSize(46);
                fill(0);
                textFont(fontNotoMedium);
                textStyle(BOLD);
                textAlign(CENTER);
                if (language === LANG_RO) {
                    text("Impresionant!", width / 2, height / 2 + 100);
                } else if (language === LANG_EN) {
                    text("Impressive!", width / 2, height / 2 + 100);
                }
                textFont(fontNotoLight);
                textStyle(NORMAL);
                if (language === LANG_RO) {
                    text("Câteva ajustări\nși ești pe podium!", width / 2, height / 2 + 200);
                } else if (language === LANG_EN) {
                    text("Few adjustments\nand you’re on top!", width / 2, height / 2 + 200);
                }
            }
            if (star1Win && !star2Win && !star3Win) { // 1 STAR
                textSize(46);
                fill(0);
                textFont(fontNotoMedium);
                textStyle(BOLD);
                textAlign(CENTER);
                if (language === LANG_RO) {
                    text("Felicitări!", width / 2, height / 2 + 100);
                } else if (language === LANG_EN) {
                    text("Congratulations!", width / 2, height / 2 + 100);
                }
                textFont(fontNotoLight);
                textStyle(NORMAL);
                if (language === LANG_RO) {
                    text("După o cursă de anduranță\nai ajuns la finiș.", width / 2, height / 2 + 200);
                } else if (language === LANG_EN) {
                    text("You’ve reached the finish line\nafter an endurance race.", width / 2, height / 2 + 200);
                }
            }
            if (!star1Win && !star2Win && !star3Win) { // 0 STAR
                textSize(46);
                fill(0);
                textFont(fontNotoMedium);
                textStyle(BOLD);
                textAlign(CENTER);
                if (language === LANG_RO) {
                    text("Felicitări!", width / 2, height / 2 + 100);
                } else if (language === LANG_EN) {
                    text("Congratulations!", width / 2, height / 2 + 100);
                }
                textFont(fontNotoLight);
                textStyle(NORMAL);
                if (language === LANG_RO) {
                    text("După o cursă de anduranță\nai ajuns la finiș.", width / 2, height / 2 + 200);
                } else if (language === LANG_EN) {
                    text("You’ve reached the finish line\nafter an endurance race.", width / 2, height / 2 + 200);
                }
            }
            // restart button.
            imageMode(CENTER);
            image(gameProp.restartButton, width / 2, height / 2 + 500);
            pop();
        }
    // }
}


function drawRotatingStar(posx, posy, isWinStart, gameProp, isShadow) {
    gameProp.startRotationParam += gameProp.STAR_ROTATION_SPEED;

    if (isShadow) {
        fill(200, 200, 200);
    } else if (isWinStart) {
        fill(255, 255, 0);
    } else {
        fill(255,255,255);
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