const CONTROL_SHOW_GAME = "gamer time sunglasses emoji";
const CONTROL_SHOW_MENU = "hyello waiter";
const CONTROL_TOUCH_OPACITY = 0.5;


var touch = {
	starts:[],
	holds:[],
	updateBefore : function() {
		//this.draggedX
	},
	updateAfter : function() {
		this.moved = false;
		this.holds = this.holds;
		this.starts = [];
		this.changed = false;
		this.movedX = 0;
		this.movedY = 0;
		this.scrolled = 0;
		this.draggedX = 0;
		this.draggedY = 0;
		this.obstructed = false;
		//console.log("bluh")
	},
	eventStart(e) {
		this.starts.push(...Array.prototype.map.call(e.changedTouches, t=>({x:t.clientX, y:t.clientY})));
		this.eventMove(e);
	},
	eventMove(e) {
		this.holds = Array.prototype.map.call(e.touches, t=>({x:t.clientX, y:t.clientY}));
		this.changed = true;
	},
	obstruct() {
		this.obstructed = true;
	}
}

class TouchController extends Controller {
	constructor() {
		super();
		//this.setBinds(binds);
		this.jumpButton = new TouchControllerButton("jump");
		this.moveStick = new TouchControllerStickLR();
	//	this.leftButton = new TouchControllerButton("left");
	//	this.rightButton = new TouchControllerButton("right");
		this.pauseButton = new TouchControllerButton("pause");
		this.menuLeftButton = new TouchControllerButtonDiamond("menuLeft");
		this.menuRightButton = new TouchControllerButtonDiamond("menuRight");
		this.menuUpButton = new TouchControllerButtonDiamond("menuUp");
		this.menuDownButton = new TouchControllerButtonDiamond("menuDown");
		this.selectButton = new TouchControllerButtonDiamond("select");
		this.cancelButton = new TouchControllerButtonDiamond("cancel");
		this.menuAltButton = new TouchControllerButtonDiamond("menuAlt");
		this.cameraStick = new TouchControllerStickCamera();
		this.cameraToggleRotateButton = new TouchControllerButton("cameraToggleRotate");
		this.cameraZoomInButton = new TouchControllerButton("cameraZoomIn");
		this.cameraZoomOutButton = new TouchControllerButton("cameraZoomOut");
		//this.muteButton = new TouchControllerButton("mute");
		/*this.cameraLeftButton = new TouchControllerButton("cameraLeft");
		this.cameraRightButton = new TouchControllerButton("cameraRight");
		this.cameraUpButton = new TouchControllerButton("cameraUp");
		this.cameraDownButton = new TouchControllerButton("cameraDown");*/
		this.buttonsGame = [
			//this.leftButton,
			//this.rightButton,
			this.moveStick,
			this.jumpButton,
			this.pauseButton,
		];
		this.buttonsMenu = [
			this.menuLeftButton,
			this.menuRightButton,
			this.menuUpButton,
			this.menuDownButton,
			this.selectButton,
			this.cancelButton,
			this.menuAltButton,
			//this.muteButton,
		];
		this.buttonsCamera = [
			this.cameraStick,
			this.cameraToggleRotateButton,
			this.cameraZoomInButton,
			this.cameraZoomOutButton,
			/*this.cameraLeftButton,
			this.cameraRightButton,
			this.cameraUpButton,
			this.cameraDownButton,*/
		];
		this.resize();
	}
	resize() {
		var bright = mainCanvas.width;
		var bbot = mainCanvas.height;
		var scald = Math.floor(Math.min(mainCanvas.width/9, mainCanvas.height/8, 30 + Math.max(mainCanvas.width, mainCanvas.height) / 16));
		//this.leftButton.resize(scald, bbot-scald, scald);
		//this.rightButton.resize(scald*3, bbot-scald, scald);
		this.moveStick.resize(scald*2, bbot-scald*2, scald*2);
		this.jumpButton.resize(bright-scald, bbot-scald, scald);
		this.pauseButton.resize(bright/2, bbot-scald, scald/2);
		this.menuLeftButton.resize(scald, bbot-scald*2, scald);
		this.menuRightButton.resize(scald*3, bbot-scald*2, scald);
		this.menuUpButton.resize(scald*2, bbot-scald*3, scald);
		this.menuDownButton.resize(scald*2, bbot-scald, scald);
		this.selectButton.resize(bright - scald*2, bbot - scald, scald);
		this.cancelButton.resize(bright - scald, bbot - scald*2, scald);
		this.menuAltButton.resize(bright - scald*3, bbot - scald*2, scald);
		//this.cameraStick.resize(bright - scald*6/2, bbot - scald*5, scald*4/4);//TODO put this back in when there are camera controls
		this.cameraToggleRotateButton.resize(bright - scald, bbot - scald*(9/2+1/8), scald*9/16);
		this.cameraZoomInButton.resize(bright - scald/2, bbot - scald*11/2, scald/2);
		this.cameraZoomOutButton.resize(bright - scald*3/2, bbot - scald*11/2, scald/2);
		/*this.cameraLeftButton.resize(bright - scald*3, bbot-scald*5, scald*2/3);
		this.cameraRightButton.resize(bright - scald, bbot-scald*5, scald*2/3);
		this.cameraUpButton.resize(bright - scald*2, bbot-scald*6, scald*2/3);
		this.cameraDownButton.resize(bright - scald*2, bbot-scald*4, scald*2/3);*/
		//this.muteButton.resize(bright - scald/2, scald/2, scald/2);
	}
	updateBefore() {
		if (justResized)
			this.resize();
		//console.log(touch.starts)
		this.unClick();
		this.buttonsGame.forEach(b=>b.update(this));
		if (runnee.controlShow == CONTROL_SHOW_MENU && !settings.directTouch) {
			this.buttonsMenu.forEach(b=>b.update(this));
		}
		this.buttonsCamera.forEach(b=>b.update(this));
	}
	updateAfter() {
		
	}
	draw() {
		mainCtx.globalAlpha = CONTROL_TOUCH_OPACITY;
		if (runnee.controlShow == CONTROL_SHOW_GAME) {
			this.buttonsGame.forEach(b=>b.draw());
		} else if (runnee.controlShow == CONTROL_SHOW_MENU && !settings.directTouch) {
			this.buttonsMenu.forEach(b=>b.draw());
		}
		if (runnee.controlShowCamera) {
			this.buttonsCamera.forEach(b=>b.draw());
		}
		mainCtx.globalAlpha = 1;
	}
	getBindText(command) {
		return "[" + KEY_NAMES[this.binds[command]] + "]";
	}
	getHoriz(offset) {
		return this.moveStick.getHoriz(this, offset);
	}
}
TouchController.prototype.type = "Touch";

class TouchControllerButton {
	constructor(command) {
		this.command = command;
		this.color = CONTROLS_INFO[this.command].touchColor;
	}
	resize(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.r2 = this.r**2;
	}
	update(par) {
		this.held = touch.holds.find(s=>this.intersects(s.x, s.y)) ? this.held+1 : 0;
		//console.log(this.held)
		this.clicked = !!touch.starts.find(s=>this.intersects(s.x, s.y));
		par[this.command] = this.held;
		par[this.command+"Clicked"] = this.clicked;
		//if (this.command == "mute")
		//	console.log(this.clicked);
	}
	intersects(x, y) {
		//console.log(this.x, this.y, x, y, (x-this.x)**2 + (y-this.y)**2, this.r2, (x-this.x)**2 + (y-this.y)**2 <= this.r2);
		return (x-this.x)**2 + (y-this.y)**2 <= this.r2;
	}
	draw() {
		mainCtx.strokeStyle = this.color;
		mainCtx.lineWidth = 4;
		mainCtx.beginPath();
		mainCtx.arc(this.x, this.y, this.r-2, 0, 2*Math.PI);
		mainCtx.closePath();
		mainCtx.stroke();
		this.drawSymbol();
	}
	drawSymbol() {
		mainCtx.beginPath();
		switch (this.command) {
			case "select":
				mainCtx.moveTo(this.x - this.r/3, this.y);
				mainCtx.lineTo(this.x, this.y + this.r/3);
				mainCtx.lineTo(this.x + this.r/3, this.y - this.r/3);
				break;
			case "cancel":
				mainCtx.moveTo(this.x - this.r/3, this.y - this.r/3);
				mainCtx.lineTo(this.x + this.r/3, this.y + this.r/3);
				mainCtx.moveTo(this.x + this.r/3, this.y - this.r/3);
				mainCtx.lineTo(this.x - this.r/3, this.y + this.r/3);
				break;
			case "menuAlt":
				mainCtx.moveTo(this.x - this.r/3, this.y);
				mainCtx.lineTo(this.x, this.y + this.r/3);
				mainCtx.lineTo(this.x + this.r/3, this.y);
				mainCtx.lineTo(this.x, this.y - this.r/3);
				mainCtx.closePath();
				break;
			case "pause":
				mainCtx.moveTo(this.x - this.r/3, this.y - this.r/2);
				mainCtx.lineTo(this.x - this.r/3, this.y + this.r/2);
				mainCtx.moveTo(this.x + this.r/3, this.y - this.r/2);
				mainCtx.lineTo(this.x + this.r/3, this.y + this.r/2);
				break;
			case "cameraZoomIn":
				mainCtx.moveTo(this.x - this.r/2, this.y);
				mainCtx.lineTo(this.x + this.r/2, this.y);
				mainCtx.moveTo(this.x, this.y - this.r/2);
				mainCtx.lineTo(this.x, this.y + this.r/2);
				break;
			case "cameraZoomOut":
				mainCtx.moveTo(this.x - this.r/2, this.y);
				mainCtx.lineTo(this.x + this.r/2, this.y);
				break;
			case "cameraToggleRotate":
				mainCtx.arc(this.x, this.y, this.r/2, Math.PI*1/3, -Math.PI*1/3, true);
				mainCtx.arc(this.x, this.y, this.r/2, Math.PI*2/3, -Math.PI*2/3);
				break;
		}
		mainCtx.stroke();
	}
}

class TouchControllerButtonDiamond extends TouchControllerButton {
	intersects(x, y) {
		return Math.abs(x-this.x) + Math.abs(y-this.y) <= this.r;
	}
	draw() {
		mainCtx.strokeStyle = this.color;
		mainCtx.lineWidth = 4;
		mainCtx.beginPath();
		mainCtx.moveTo(this.x-this.r+3, this.y);
		mainCtx.lineTo(this.x, this.y-this.r+3);
		mainCtx.lineTo(this.x+this.r-3, this.y);
		mainCtx.lineTo(this.x, this.y+this.r-3);
		mainCtx.closePath();
		mainCtx.stroke();
		this.drawSymbol();
	}
}

class TouchControllerStick {
	constructor() {
		this.rotation = 0;
	}
	resize(x, y, r) {
		this.x = x;
		this.y = r;
		this.r = r;
		this.parts.forEach(p=>p.resize(x, y, r));
	}
	update(par) {
		this.parts.forEach(p=>p.update(par, this));
	}
	draw() {
		this.parts.forEach(p=>p.draw(this));
	}
	getHoriz(par, offset) {
		this.rotation = offset;
		this.parts.forEach(p=>p.update(par, this));
		return 0 + !!par.right - !!par.left;
	}
}

class TouchControllerStickLR extends TouchControllerStick {
	constructor() {
		super();
		this.leftButton = new TouchControllerStickPart("left", Math.PI*3/2, 1/4);
		this.rightButton = new TouchControllerStickPart("right", Math.PI/2, 1/4);
		this.parts = [
			this.leftButton,
			this.rightButton,
		];
	}
}

class TouchControllerStickCamera extends TouchControllerStick {
	constructor() {
		super();
		let port = 2/7;
		this.leftButton = new TouchControllerStickPart("cameraLeft", Math.PI*3/2, port);
		this.rightButton = new TouchControllerStickPart("cameraRight", Math.PI/2, port);
		this.upButton = new TouchControllerStickPart("cameraUp", 0, port);
		this.downButton = new TouchControllerStickPart("cameraDown", Math.PI, port);
		this.parts = [
			this.leftButton,
			this.rightButton,
			this.upButton,
			this.downButton,
		];
	}
}

class TouchControllerStickPart extends TouchControllerButton {
	constructor(communism, rotatO, inner) {
		super(communism);
		this.rotatO = rotatO;
		this.rotation = this.rotatO;
		this.inner = inner;
		this.dCCW = Math.asin(this.inner);
		this.dCW = Math.PI - this.dCCW;
	}
	resize(x, y, r) {
		super.resize(x, y, r);
		this.r2 *= 1.2; //is this a dumb fix?
	}
	intersects(x, y) {
		return super.intersects(x, y) && new VectorRect(x-this.x, y-this.y).rotate(-this.rotation).y < -this.r * this.inner;
	}
	update(par, stick) {
		this.rotation = stick.rotation + this.rotatO;
		super.update(par);
	}
	draw(stick) {
		this.rotation = stick.rotation + this.rotatO;
		mainCtx.strokeStyle = this.color;
		mainCtx.lineWidth = 4;
		mainCtx.beginPath();
		mainCtx.arc(this.x, this.y, this.r-2, this.dCCW + this.rotation, this.dCW + this.rotation);
		mainCtx.closePath();
		mainCtx.stroke();
		//super.draw();//TODO change it
	}
}

function addTouchEvents() {
	mainCanvas.addEventListener("touchstart", function(e) {
		if (!pControllers.find(p=>p instanceof TouchController))
			pControllers.push(new TouchController());
		//if (runnee.overrideTouch) because otherwise it'll sometimes click twice and i don't know how else to fix that
			e.preventDefault();
		touch.eventStart(e);
	});
	
	mainCanvas.addEventListener("touchend", function(e) {
		if (!(runnee.overrideTouch == false))
			e.preventDefault();
		touch.eventMove(e);
	});
	
	mainCanvas.addEventListener("touchcancel", function(e) {
		if (!(runnee.overrideTouch == false))
			e.preventDefault();
		touch.eventMove(e);
	});
	
	mainCanvas.addEventListener("touchmove", function(e) {
		if (runnee.overrideTouch)
			e.preventDefault();
		touch.eventMove(e);
	});
}