class MenuThing {
	hoverNothing() {
		this.hovered = null;
	}
	hoverDefault(ting) {
		if (!this.hovered)
			this.hovered = ting;
	}
}

class Screen extends MenuThing {

	objectMousedOver(thing) {
		this.hover(thing);
	}
	hover(thing) {
		if (thing) {
			this.hovered = thing;
		}
	}
	isHovered(thing) {
		return thing == this.hovered;
	}
}

class MenuScreen extends Screen {
	constructor(args) {
		super();
		this.mainButtons = this.mapToButton(args.mainButtons);
		if (this.mainButtons) {
			this.mainButtonsTop = args.mainButtonsTop;
		}
		this.objects = [
			...this.mainButtons,
		]
		this.connect();
		this.resize();
		this.hover(this.mainButtons[0]);
		this.cursor = new MenuCursor(this);
	}
	resize() {
		for (var i = 0; i < this.mainButtons.length; i++) {
			this.mainButtons[i].resize(mainCanvas.width/10, mainCanvas.height/2 + mainCanvas.height/10*i, mainCanvas.width*4/5, mainCanvas.height/15);
		}
	}
	connect() {
		for (var i = 0; i < this.mainButtons.length - 1; i++) {
			this.mainButtons[i].connectDown = this.mainButtons[i+1];
			this.mainButtons[i+1].connectUp = this.mainButtons[i];
		}
	}
	mapToButton(butt) {
		if (Array.isArray(butt)) {
			return butt.map(b=>this.mapToButton(b));
		} else if (butt instanceof MenuObject) {
			return butt;
		} else {
			return new MenuButton(butt);
		}
	}
	update() {
		/*if (globalController.selectClicked) {
			this.mainButtons[this.buttonIndex].func();
			return;
		} else if (globalController.menuUpClicked && this.buttonIndex > 0)
			this.buttonIndex--;
		else if (globalController.menuDownClicked && this.buttonIndex < this.mainButtons.length-1)
			this.buttonIndex++;*/
		if (!this.cursor.update()){
			this.objects.forEach(o=>o.update(this));
		}
	}
	draw() {
		clearCanvas();
		mainCtx.font = "30px "+getFont();
		mainCtx.fillStyle = "#BFBFBF";
		this.objects.forEach(o=>o.draw());
		this.cursor.draw();
		//mainCtx.fillText("A: Select", mainCanvas.width/2, mainCanvas.height-50);
	}
}
MenuScreen.prototype.mainButtons = [];

class SingleMenuScreen extends MenuScreen {
	constructor(args) {
		super(args);
	}
}

class MenuCursor extends MenuThing {
	constructor(menu) {
		super();
		this.menu = menu;
	}
	update()  {
		//console.log(mouse.changed)
		if (globalController.isCommandPressedRepeating("menuUp")) {
			this.menu.hover(this.menu.hovered.connectUp);
		}
		if (globalController.isCommandPressedRepeating("menuDown")) {
			this.menu.hover(this.menu.hovered.connectDown);
		}
		if (globalController.isCommandPressedRepeating("menuLeft")) {
			this.menu.hover(this.menu.hovered.connectLeft);
		}
		if (globalController.isCommandPressedRepeating("menuRight")) {
			this.menu.hover(this.menu.hovered.connectRight);
		}
		this.hovered = this.menu.hovered;
	}
	draw() {
		var lastHovered = this.hovered;
		this.hovered = this.menu.hovered;
		this.rect = this.hovered.getCursorRect();
		if (this.hovered) {
			mainCtx.lineWidth = 2;
			mainCtx.strokeStyle = "#FFFFFF";
			mainCtx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
		}
	}
}

function getFont() {
	return "monospace";
}

const UI_SHAPE_RECT = "rect";

class MenuObject extends MenuThing {
	constructor(args = {}) {
		super();
		this.lText = args.lText;
		if (this.lText) {
			this.text = lg(this.lText);
		}
		if (args.bindCancel)
			this.bindCancel = args.bindCancel;
	}
	resize(...bleh) {
		this.resizeRect(...bleh);
		this.justResized = true;
	}
	resizeRect(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.justResized = true;
	}
	update(menu) {
		this.mouseClicked = false;
		this.mouseRightClicked = false;
		this.wasHovered = this.hovered;
		if (mouse.changed || this.justResized) {
			if (!mouse.obstructed && this.intersectsMouse()) {
				this.mouseHovered = true;
				if (this.hoverable)
					menu.objectMousedOver(this);
				if (mouse.clicked)
					this.mouseClicked = true;
				if (mouse.rightClicked)
					this.mouseRightClicked = true;
			} else {
				this.mouseHovered = false;
			}
		}
		if (this.hoverable) {
			this.hovered = menu.isHovered(this);
			this.clicked = (this.bindCancel && globalController.cancelClicked && !globalController.selectClicked && !mouse.clicked) || (this.hovered && (globalController.selectClicked || this.mouseClicked));
			this.altClicked = this.hovered && (globalController.menuAltClicked || this.mouseRightClicked);
			this.draggedOnto = !this.wasHovered && this.hovered && (globalController.select || mouse.down);
		}
		this.justResized = false;
	}
	intersectsMouse() {
		return this.intersectsPointRect(mouse.x, mouse.y);
	}
	intersectsPointRect(x, y) {
		return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
	}
	objectMousedOver(thing) {
		this.hover(thing);
	}
	hover(thing) {
		if (!thing) {
			return false;
		} if (this.cursor) {
			this.hovered = thing;
		} else {
			(this.parent || this.menu).hover(thing);
		}
	}
	isHovered(thing) {
		if (this.cursor) {
			return thing == this.hovered;
		} else {
			return (this.parent || this.menu || this.engine).isHovered(thing);
		}
	}
	getCursorRect() {
		return this;
	}
}

class MenuButton extends MenuObject {
	constructor(args) {
		super(args);
		this.func = args.func || doNothing;
	}
	update(menu) {
		super.update(menu);
		if (this.clicked) {
			this.func();
		}
	}
	draw() {
		//console.log(this.text, this.x, this.y, this.width, this.height);
		drawTextInRect(this.text, this.x, this.y, this.width, this.height);
	}
}
MenuButton.prototype.hoverable = true;
MenuButton.prototype.intersectShape = UI_SHAPE_RECT;

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
		to = new to();
	}
	if (!isWaitingForLoad()) {
		runnee = to;
		if (to.switchin)
			to.switchin();
	} else {
		runnee = new LoadingScreen(to);
	}
	//particles.push(new ColorFade(4, 0, 0));
}