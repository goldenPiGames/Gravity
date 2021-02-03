class MenuScreen {
	constructor(args) {
		this.mainButtons = args.mainButtons;
		if (this.mainButtons) {
			this.mainButtonsTop = args.mainButtonsTop;
		}
		this.buttonIndex = 0;
	}
	update() {
		if (globalController.selectClicked) {
			this.mainButtons[this.buttonIndex].func();
			return;
		} else if (globalController.menuUpClicked && this.buttonIndex > 0)
			this.buttonIndex--;
		else if (globalController.menuDownClicked && this.buttonIndex < this.mainButtons.length-1)
			this.buttonIndex++;
	}
	draw() {
		clearCanvas();
		for (var i = 0; i < this.mainButtons.length; i++) {
			drawTextInRect(lg(this.mainButtons[i].lText), mainCanvas.width/10, mainCanvas.height/2 + mainCanvas.height/10*i, mainCanvas.width*4/5, mainCanvas.height/15);
		}
		mainCtx.fillStyle = "#00FFFF";
		//mainCtx.drawImage(miscSprites.Selector, mainCanvas.width/2 - mainCtx.measureText(this.mainButtons[this.buttonIndex].text).width/2 - miscSprites.Selector.width - 10, MAIN_BUTTON_START-40 + MAIN_BUTTON_SPACING * (this.buttonIndex+.5) - miscSprites.Selector.height/2);
		//flipHorizontally(miscSprites.Selector, mainCanvas.width/2 + mainCtx.measureText(this.mainButtons[this.buttonIndex].text).width/2 + 10, MAIN_BUTTON_START-40 + MAIN_BUTTON_SPACING * (this.buttonIndex+.5) - miscSprites.Selector.height/2);
		mainCtx.font = "30px "+getFont();
		mainCtx.fillStyle = "#BFBFBF";
		//mainCtx.fillText("A: Select", mainCanvas.width/2, mainCanvas.height-50);
	}
}

class SingleMenuScreen extends MenuScreen {
	constructor(args) {
		super(args);
	}
}

function getFont() {
	return "monospace";
}

/*class OverScreen extends Screen {
	constructor() {
		super();
	}
	clickedOutside() {
		return mouse.clicked && !this.intersectsMouse();
	}
	fillBackAndFrame(alphaAll, alphaBack) {
		mainCtx.fillStyle = palette.background;
		mainCtx.globalAlpha = alphaAll;
		mainCtx.fillRect(0, 0, WIDTH, HEIGHT);
		mainCtx.globalAlpha = alphaBack;
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		mainCtx.globalAlpha = 1;
		mainCtx.lineWidth = 4;
		mainCtx.strokeStyle = palette.normal;
		mainCtx.strokeRect(this.x, this.y, this.width, this.height);
	}
}
OverScreen.prototype.overrideTouch = false;
OverScreen.prototype.intersectsMouse = UIObject.prototype.intersectsMouse;*/

function switchScreen(to) {
	if (typeof to == "function") {
		if (to.prototype.isScreen)
			to = new to();
		else {
			to();
			return;
		}
	}
	runnee = to;
	//particles.push(new ColorFade(4, 0, 0));
}