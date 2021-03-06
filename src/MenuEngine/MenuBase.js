class MenuThing {
	update() {
		this.timeSinceLastUpdated = this.lastUpdated - globalTimer;
		this.lastUpdated = globalTimer;
	}
	hoverNothing() {
		this.hovered = null;
	}
	hoverDefault(ting) {
		if (!this.hovered) {
			this.hover(ting);
		}
	}
}

class Screen extends MenuThing {
	objectMousedOver(thing) {
		this.hover(thing);
	}
	hover(thing) {
		if (thing) {
			while (thing.doesConnectForward)//may cause infinite loops if you're stupid
				thing = thing.getConnectForward(this.hovered);
			if (this.hovered != thing) {
				this.hovered = thing;
				if (this.playsHoverSFX) {
					//playSFX("Blip1");
				}
			}
		}
	}
	isHovered(thing) {
		return thing == this.hovered;
	}
}
Screen.prototype.controlShow = CONTROL_SHOW_MENU;

class MenuScreen extends Screen {
	constructor(args) {
		super();
		this.cursor = new MenuCursor(this);
		requireSFX("Blip1", 5);
	}
	resizeCenter() {
		
	}
	connectHoriz(...butt) {
		connectHoriz(...butt);
	}
	connectVert(...butt) {
		connectVert(...butt);
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
		super.update();
		if (!this.cursor.update()){
			this.menuObjects.forEach(o=>o.update(this));
		}
	}
	draw() {
		this.menuObjects.forEach(o=>o.draw());
		this.cursor.draw();
		//mainCtx.fillText("A: Select", mainCanvas.width/2, mainCanvas.height-50);
}
	}
MenuScreen.prototype.playsHoverSFX = true;

function connectHoriz(...butt) {
	butt = butt.filter(a=>a);
	for (var i = 0; i < butt.length - 1; i++) {
		butt[i].setConnectRight(butt[i+1]);
		butt[i+1].setConnectLeft(butt[i]);
	}
}

function connectVert(...butt) {
	butt = butt.filter(a=>a);
	for (var i = 0; i < butt.length - 1; i++) {
		butt[i].setConnectDown(butt[i+1]);
		butt[i+1].setConnectUp(butt[i]);
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
		if (args.text && !this.text)
			this.text = args.text;
		if (args.bindCancel)
			this.bindCancel = args.bindCancel;
		if (args.needDoubleTap)
			this.needDoubleTap = args.needDoubleTap;
	}
	resize(...bleh) {
		this.resizeRect(...bleh);
		this.justResized = true;
	}
	resizeRect(x, y, width, height) {
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.width = Math.floor(width);
		this.height = Math.floor(height);
		this.justResized = true;
	}
	update(menu) {
		super.update();
		this.mouseClicked = false;
		this.mouseRightClicked = false;
		this.touchClicked = false;
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
		if (settings.directTouch && touch.changed) {
			if (!touch.obstructed && this.intersectsTouchStart()) {
				if (this.hoverable)
					menu.objectMousedOver(this);
				this.touchClicked = true;
			}
		}
		if (this.hoverable) {
			this.hovered = menu.isHovered(this);
			this.clicked = (this.touchClicked && (!this.needDoubleTap || this.wasHovered)) || (this.bindCancel && globalController.cancelClicked && !globalController.selectClicked && !mouse.clicked) || (this.hovered && (globalController.selectClicked || this.mouseClicked));
			this.altClicked = this.hovered && (globalController.menuAltClicked || this.mouseRightClicked);
			this.draggedOnto = !this.wasHovered && this.hovered && (globalController.select || mouse.down);
		}
		this.justResized = false;
	}
	intersectsMouse() {
		return this.intersectsPointRect(mouse.x, mouse.y);
	}
	intersectsTouchStart() {
		return !!touch.starts.find(t=>this.intersectsPointRect(t.x, t.y));
	}
	intersectsPointRect(x, y) {
		//console.log(x, y);
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
	setConnectUp(t) {
		this.connectUp = t;
	}
	setConnectDown(t) {
		this.connectDown = t;
	}
	setConnectLeft(t) {
		this.connectLeft = t;
	}
	setConnectRight(t) {
		this.connectRight = t;
	}
}
MenuObject.prototype.needDoubleTap = false;

class MenuButton extends MenuObject {
	constructor(args) {
		super(args);
		this.func = args.func || doNothing;
		this.sprites = getSpriteSheet("ButtonBevelGrey");
	}
	resize(...subscribeToTechnoblade) {
		super.resize(...subscribeToTechnoblade);
	}
	update(menu) {
		super.update(menu);
		if (this.clicked) {
			this.func() && this.enabled;
		}
	}
	draw() {
		//console.log(this.text, this.x, this.y, this.width, this.height);
		mainCtx.fillStyle = this.color || "#808080";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sprites.drawBorderOnMain(this.x, this.y, this.width, this.height);
		drawTextInRect(this.text, this.x+4, this.y+4, this.width-8, this.height-8, {fill:"#FFFFFF"});
	}
}
MenuButton.prototype.enabled = true;
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
	runnee.resize();
	//particles.push(new ColorFade(4, 0, 0));
}