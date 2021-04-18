const CONTROL_SHOW_GAME = "gamer time sunglasses emoji";
const CONTROL_SHOW_MENU = "hyello waiter";

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
		this.leftButton = new TouchControllerButton("left");
		this.rightButton = new TouchControllerButton("right");
		this.pauseButton = new TouchControllerButton("pause");
		this.menuLeftButton = new TouchControllerButton("menuLeft");
		this.menuRightButton = new TouchControllerButton("menuRight");
		this.menuUpButton = new TouchControllerButton("menuUp");
		this.menuDownButton = new TouchControllerButton("menuDown");
		this.selectButton = new TouchControllerButton("select");
		this.cancelButton = new TouchControllerButton("cancel");
		this.menuAltButton = new TouchControllerButton("menuAlt");
		this.cameraLeftButton = new TouchControllerButton("cameraLeft");
		this.cameraRightButton = new TouchControllerButton("cameraRight");
		this.cameraUpButton = new TouchControllerButton("cameraUp");
		this.cameraDownButton = new TouchControllerButton("cameraDown");
		this.buttonsGame = [
			this.leftButton,
			this.rightButton,
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
		];
		this.buttonsCamera = [
			this.cameraLeftButton,
			this.cameraRightButton,
			this.cameraUpButton,
			this.cameraDownButton,
		];
		this.resize();
	}
	resize() {
		var bright = mainCanvas.width;
		var bbot = mainCanvas.height;
		var scald = 20 + Math.floor(Math.min(mainCanvas.width/2, mainCanvas.height/2, Math.max(mainCanvas.width, mainCanvas.height)) / 10);
		this.leftButton.resize(scald +5, bbot-scald -5, scald);
		this.rightButton.resize(scald*3 +5, bbot-scald -5, scald);
		this.jumpButton.resize(bright-scald -5, bbot-scald -5, scald);
		this.pauseButton.resize(bright/2, bbot-scald, scald/2);
		this.menuLeftButton.resize(scald +5, bbot-scald*2 -5, scald*2/3);
		this.menuRightButton.resize(scald*3 +5, bbot-scald*2 -5, scald*2/3);
		this.menuUpButton.resize(scald*2 +5, bbot-scald*3 -5, scald*2/3);
		this.menuDownButton.resize(scald*2 +5, bbot-scald -5, scald*2/3);
		this.selectButton.resize(bright - scald*2 -5, bbot - scald -5, scald*4/5);
		this.cancelButton.resize(bright - scald -5, bbot - scald*9/4 -5, scald*2/3);
		this.menuAltButton.resize(bright - scald*3 -5, bbot - scald*9/4 -5, scald*2/3);
		this.cameraLeftButton.resize(bright - scald*3 +5, bbot-scald*5 -5, scald*2/3);
		this.cameraRightButton.resize(bright - scald +5, bbot-scald*5 -5, scald*2/3);
		this.cameraUpButton.resize(bright - scald*2 +5, bbot-scald*6 -5, scald*2/3);
		this.cameraDownButton.resize(bright - scald*2 +5, bbot-scald*4 -5, scald*2/3);
	}
	updateBefore() {
		if (justResized)
			this.resize();
		//console.log(touch.starts)
		this.buttonsGame.forEach(b=>b.update(this));
		if (runnee.controlShow == CONTROL_SHOW_MENU) {
			this.buttonsMenu.forEach(b=>b.update(this));
		}
		this.buttonsCamera.forEach(b=>b.update(this));
	}
	updateAfter() {
		
	}
	draw() {
		if (runnee.controlShow == CONTROL_SHOW_GAME) {
			this.buttonsGame.forEach(b=>b.draw());
		} else if (runnee.controlShow == CONTROL_SHOW_MENU) {
			this.buttonsMenu.forEach(b=>b.draw());
		}
		if (runnee.controlShowCamera) {
			this.buttonsCamera.forEach(b=>b.draw());
		}
	}
	getBindText(command) {
		return "[" + KEY_NAMES[this.binds[command]] + "]";
	}
}

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
	}
	intersects(x, y) {
		//console.log(this.x, this.y, x, y, (x-this.x)**2 + (y-this.y)**2, this.r2, (x-this.x)**2 + (y-this.y)**2 <= this.r2);
		return (x-this.x)**2 + (y-this.y)**2 <= this.r2;
	}
	draw() {
		mainCtx.strokeStyle = this.color;
		mainCtx.lineWidth = 4;
		mainCtx.beginPath();
		mainCtx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		mainCtx.closePath();
		mainCtx.stroke();
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