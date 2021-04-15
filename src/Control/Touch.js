const CONTROL_SHOW_GAME = "gamer time sunglasses emoji";

var touchStarts = [];
var touches = [];

class TouchController extends Controller {
	constructor() {
		super();
		//this.setBinds(binds);
		this.jumpButton = new TouchControllerButton("jump");
		this.leftButton = new TouchControllerButton("left");
		this.rightButton = new TouchControllerButton("right");
		this.pauseButton = new TouchControllerButton("pause");
		this.buttonsAll = [
			this.leftButton,
			this.rightButton,
			this.jumpButton,
			this.pauseButton,
		];
		this.buttonsGame = [
			this.leftButton,
			this.rightButton,
			this.jumpButton,
			this.pauseButton,
		];
		this.resize();
	}
	resize() {
		this.leftButton.resize(50, mainCanvas.height-50, 40);
		this.rightButton.resize(130, mainCanvas.height-50, 40);
		this.jumpButton.resize(mainCanvas.width-80, mainCanvas.height-50, 40);
	}
	updateBefore() {
		if (justResized)
			this.resize();
		//console.log(touchStarts)
		this.buttonsAll.forEach(b=>b.update(this));
	}
	updateAfter() {
		touchStarts = [];//TODO put this somewhere else?
	}
	draw() {
		if (runnee.controlShow == CONTROL_SHOW_GAME) {
			this.buttonsGame.forEach(b=>b.draw());
		} else {
			//this.buttonsGame.forEach(b=>b.draw());
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
		this.held = !!touches.find(s=>this.intersects(s.x, s.y));
		//console.log(this.held)
		this.clicked = !!touchStarts.find(s=>this.intersects(s.x, s.y));
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

function updateTouches(to) {
	touches = Array.prototype.map.call(to, t=>({x:t.clientX, y:t.clientY}));
}

function addTouchEvents() {
	mainCanvas.addEventListener("touchstart", function(e) {
		if (!pControllers.find(p=>p instanceof TouchController))
			pControllers.push(new TouchController());
		//if (runnee.overrideTouch) because otherwise it'll sometimes click twice and i don't know how else to fix that
			e.preventDefault();
		mouse.changed = true;
		mouse.clicked = true;
		mouse.down = true;
		//console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		touchStarts.push({x:e.changedTouches[0].clientX, y:e.changedTouches[0].clientY});
		mouse.lastUsed = "touch";
		updateTouches(e.touches);
	});
	
	mainCanvas.addEventListener("touchend", function(e) {
		if (!(runnee.overrideTouch == false))
			e.preventDefault();
		mouse.down = false;
		mouse.x = NaN;
		mouse.y = NaN;
		updateTouches(e.touches);
	});
	
	mainCanvas.addEventListener("touchcancel", function(e) {
		if (!(runnee.overrideTouch == false))
			e.preventDefault();
		mouse.down = false;
		mouse.x = NaN;
		mouse.y = NaN;
		updateTouches(e.touches);
	});
	
	mainCanvas.addEventListener("touchmove", function(e) {
		if (runnee.overrideTouch)
			e.preventDefault();
		setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		mouse.lastUsed = "touch";
		updateTouches(e.touches);
	});
}