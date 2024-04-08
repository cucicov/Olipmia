


function drawPopUp(gameProp) {
    if (gameProp.cardPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(gameProp.cardPopUpProperties);

        push();
        fill(255);
        if (gameProp.propertiesIdentifier === "tl"){
            translate(gameProp.cardMatchProperties.placeholder.posx,
                gameProp.cardMatchProperties.placeholder.posy);
        } else if (gameProp.propertiesIdentifier === "mem") {
            translate(gameProp.cardPopUpProperties.popupPosx,
                gameProp.cardPopUpProperties.popupPosy);

        } else if (gameProp.propertiesIdentifier === "puz12" || gameProp.propertiesIdentifier === "puz20" || gameProp.propertiesIdentifier === "puz30") {
            translate(gameProp.cardPopUpProperties.popupPosx,
                gameProp.cardPopUpProperties.popupPosy);

        }

        scale(scaleRatio);

        if (gameProp.propertiesIdentifier === "tl"){
            imageMode(CENTER);
            //fix for displaying marginal cards.
            let calculatedPosx = 0;
            if (gameProp.cardMatchProperties.placeholder.id === 1) {
                calculatedPosx =+ 280;
            }
            if (gameProp.cardMatchProperties.placeholder.id === 7) {
                calculatedPosx =- 280;
            }
            image(gameProp.cardMatchProperties.placeholder.correctCardDetailsImage, calculatedPosx, 0);
        } else if (gameProp.propertiesIdentifier === "mem") {
            rectMode(CENTER);
            rect(0, 0, gameProp.cardPopUpProperties.popupWidth, gameProp.cardPopUpProperties.popupHeight, 30);
            textFont(fontNotoMedium);
            textStyle(NORMAL);
            textAlign(LEFT);
            textSize(45);
            fill(0);
            text(gameProp.cardPopUpProperties.currentTitle, -400, -170);
            textFont(fontNotoLight);
            textSize(24);
            textAlign(LEFT);
            fill(0);
            text(gameProp.cardPopUpProperties.currentDescription, -400, -90);
            textSize(60);
            textFont(fontZebrra);
            fill(0);
            text(gameProp.cardPopUpProperties.currentYear, -400, 230);

        } else if (gameProp.propertiesIdentifier === "puz12" || gameProp.propertiesIdentifier === "puz20" || gameProp.propertiesIdentifier === "puz30") {
            rectMode(CENTER);
            rect(0, 0, gameProp.cardPopUpProperties.popupWidth, gameProp.cardPopUpProperties.popupHeight, 30);
            textFont(fontNotoMedium);
            textStyle(NORMAL);
            textAlign(LEFT);
            textSize(45);
            fill(0);
            text(gameProp.cardPopUpProperties.currentTitle, -400, -270);
            textFont(fontNotoLight);
            textSize(24);
            textAlign(LEFT);
            fill(0);
            text(gameProp.cardPopUpProperties.currentDescription, -400, -100);
            textSize(60);
            textFont(fontZebrra);
            fill(0);
            text(gameProp.cardPopUpProperties.currentYear, -400, 300);
            scale(0.7);
            image(gameProp.cardPopUpProperties.sportImage, 400, 270);

        }
        pop();

        if (scaleRatio === 0) {
            gameProp.cardPopUpProperties.displayPopUp = false;
        }
    }
}



function initShowInfoPopUp(gameProp) {
    if (!gameProp.infoPopUpProperties.showPropertiesInitialized) {
        gameProp.infoPopUpProperties.dynamicRadius = 10;
        gameProp.infoPopUpProperties.targetRadius = 30;
        gameProp.infoPopUpProperties.currentSize = 20;
        gameProp.infoPopUpProperties.elasticity = 0.07;
        gameProp.infoPopUpProperties.velocity = 2;
        gameProp.infoPopUpProperties.position = 0;
        gameProp.infoPopUpProperties.inc = 3;

        gameProp.infoPopUpProperties.displayPopUp = true;
        gameProp.infoPopUpProperties.showPropertiesInitialized = true;
        gameProp.infoPopUpProperties.hidePropertiesInitialized = false;
    }
}


function initHideInfoPopUp(gameProp) {
    if (!gameProp.infoPopUpProperties.hidePropertiesInitialized) {
        gameProp.infoPopUpProperties.dynamicRadius = 0;
        gameProp.infoPopUpProperties.targetRadius = 10;
        gameProp.infoPopUpProperties.currentSize = 0;
        gameProp.infoPopUpProperties.elasticity = 0.05;
        gameProp.infoPopUpProperties.velocity = 12;
        gameProp.infoPopUpProperties.position = 20;
        gameProp.infoPopUpProperties.inc = 0;

        gameProp.infoPopUpProperties.showPropertiesInitialized = false;
        gameProp.infoPopUpProperties.hidePropertiesInitialized = true;
    }
}



function calculatePopUpScaleRatio(properties) {
    if (properties.dynamicRadius <= 50) {
        properties.dynamicRadius += properties.inc;
    }

    // Apply elastic force
    let force = (properties.targetRadius - properties.currentSize) * properties.elasticity;
    properties.velocity += force;
    properties.position += properties.velocity;

    // Update the size
    properties.currentSize = max(0, properties.position) + properties.dynamicRadius;
    let scaleRatio = map(properties.currentSize, 0, 52, 0, 1);
    return scaleRatio;
}



function drawInfoPopUp(posx, posy, gameProp) {
    if (gameProp.infoPopUpProperties.displayPopUp) {
        let scaleRatio = calculatePopUpScaleRatio(gameProp.infoPopUpProperties);

        push();
        noStroke();
        fill(255);
        translate(posx, posy);
        scale(scaleRatio);
        rectMode(CENTER);
        rect(0, 0, 2800, 2500, 70);
        stroke(1);
        strokeWeight(7);

        // X
        line(1200, -1150, 1300, -1050);
        line(1200, -1050, 1300, -1150);

        // stars

        let {star1Win, star2Win, star3Win} = getWinStarSettings(gameProp);
        drawRotatingStar(0 - 400, 0 - 880, star1Win, gameProp);
        drawRotatingStar(0, 0 - 880, star2Win, gameProp);
        drawRotatingStar(0 + 400, 0 - 880, star3Win, gameProp);

        pop();

        if (scaleRatio === 0) {
            gameProp.infoPopUpProperties.displayPopUp = false;
        }

    }
}



function initShowPopUp(gameProp, placeholder) {
    if (!gameProp.cardPopUpProperties.showPropertiesInitialized) {
        if (gameProp.propertiesIdentifier === "tl") { // timeline setting.
            gameProp.cardMatchProperties.placeholder = placeholder; // this is saved in the more general cardMatchProperties object.
        }

        gameProp.cardPopUpProperties.currentSize = 0;
        gameProp.cardPopUpProperties.position = 0;
        gameProp.cardPopUpProperties.velocity = 2;
        gameProp.cardPopUpProperties.targetRadius = 30;
        gameProp.cardPopUpProperties.elasticity = 0.07;
        gameProp.cardPopUpProperties.dynamicRadius = 0;
        gameProp.cardPopUpProperties.inc = 3;

        gameProp.cardPopUpProperties.showPropertiesInitialized = true;
        gameProp.cardPopUpProperties.hidePropertiesInitialized = false;
        gameProp.cardPopUpProperties.displayPopUp = true;
    }
}


function initHidePopUp(gameProp) {
    if (!gameProp.cardPopUpProperties.hidePropertiesInitialized) {
        gameProp.cardPopUpProperties.currentSize = 0;
        gameProp.cardPopUpProperties.position = 20;
        gameProp.cardPopUpProperties.velocity = 12;
        gameProp.cardPopUpProperties.targetRadius = 10;
        gameProp.cardPopUpProperties.elasticity = 0.05;
        gameProp.cardPopUpProperties.dynamicRadius = 0;
        gameProp.cardPopUpProperties.inc = 0;

        gameProp.cardPopUpProperties.hidePropertiesInitialized = true;
        gameProp.cardPopUpProperties.showPropertiesInitialized = false;
    }
}

function checkInfoPopUpClosed(gameProp) {
    if (mouseX > 1680 && mouseX < 1730 && mouseY < 1400 && mouseY > 1340) {
        initHideInfoPopUp(gameProp);

        if (gameProp.propertiesIdentifier === "mem"){
            // workaround to not display final pop up anymore.
            mem.infoPopUpProperties.showPropertiesInitialized = true;
        }
    }
}

