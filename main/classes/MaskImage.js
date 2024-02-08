
class MaskImage {
    /*
    * @param image - image of the sports person.
    * @param sportId - correct associated sport id.
    * @param crop1 - initial size of the crop image.
    * @param crop2 - level 2 of the crop image.
    * @param crop3 - level 3 of the crop image.
     */
    constructor(image, sportId, crop1, crop2, crop3, gameProp) {
        this.image = image;
        this.associatedId = sportId;

        this.cropWidth = crop1.cropWidth;
        this.cropHeight = crop1.cropHeight;
        this.sourceCropX = crop1.sourceCropX;
        this.sourceCropY = crop1.sourceCropY;

        this.crop2Settings = crop2;
        this.crop3Settings = crop3;

        this.zoomStep = 5;
        this.zoomLevel = 1;
        this.gameProp = gameProp;
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
        if (this.zoomLevel === this.gameProp.ERRORS_LEVEL_1) {
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

        if (this.zoomLevel >= this.gameProp.ERRORS_LEVEL_2) {
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
