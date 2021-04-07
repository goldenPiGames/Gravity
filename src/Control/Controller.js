var pControllers = [];

var keysPressed = {};
var keysHeld = {};

function isKeyHeld(c) {
	return keysHeld[c];
}

function isKeyPressed(c) {
	return keysPressed[c]>=globalTimer;
}

const KEY_REPEAT_DELAY = 10;
const KEY_REPEAT_RATE = 3;

class Controller {
	constructor() {
		COMMAND_LIST.forEach(nom =>	{
			this[nom] = false;
			this[nom+"Clicked"] = false;
		});
	}
	updateAfter() {
		this.unClick();
	}
	unClick() {
		COMMAND_LIST.forEach(nom =>	this[nom+"Clicked"] = false);
	}
	setBinds(newbinds) {
		if (newbinds)
			this.binds = newbinds;
		this.rbinds = [];
		for (var b in this.binds) {
			if (!this.rbinds[this.binds[b]])
				this.rbinds[this.binds[b]] = [b];
			else
				this.rbinds[this.binds[b]].push(b);
		}
	}
	setCommand(name, pressed) {
		if (pressed && !this[name])
			this[name+"Clicked"] = true;
		this[name] = pressed;
	}
	getMoveVector() {
		var x = !!this.right - !!this.left;
		var y = !!this.down - !!this.up;
		//console.log(x, y);
		return new VectorRect(x, y).capR(1);
	}
	getCameraVector() {
		var x = !!this.cameraRight - !!this.cameraLeft;
		var y = !!this.cameraDown - !!this.cameraUp;
		return new VectorRect(x, y).capR(1);
	}
	isCommandPressedRepeating(com) {
		return this[com+"Clicked"] || this[com] >= KEY_REPEAT_DELAY && (this[com] - KEY_REPEAT_DELAY) % KEY_REPEAT_RATE == 0;
	}
}

class KeyboardController extends Controller {
	constructor() {
		super();
		//this.setBinds(binds);
	}
	updateBefore() {
		COMMAND_LIST.forEach(com => {
			this[com] = CONTROLS_INFO[com].defaultKeyboardFull.find(k=>isKeyHeld(k)) ? this[com]+1 : 0;
			this[com+"Clicked"] = !!CONTROLS_INFO[com].defaultKeyboardFull.find(k=>isKeyPressed(k));
		});
		//console.log(this.rightClicked);
	}
	updateAfter() {
		
	}
	getBindText(command) {
		return "[" + KEY_NAMES[this.binds[command]] + "]";
	}
}
//KeyboardController.prototype.binds = DEFAULT_BINDS_KEYBOARD;

class NormalKeyboardController extends KeyboardController {
	
}
/*
class GamepadController extends Controller {
	constructor(gpindex, binds, stickbinds, stickbindNames) {
		super();
		this.gpindex = gpindex;
		this.setBinds(binds, stickbinds, stickbindNames);
	}
	updateBefore() {
		var gamepad = getGamepad(this.gpindex);
		//console.log(gamepad)
		//usingGamepad = !!gamepad;
		if (!gamepad)
			return;
		COMMAND_LIST.forEach(com => {
			//console.log(com);
			this[com+"Last"] = this[com];
			this[com] = (this.binds[com] >= 0 && gamepad.buttons[this.binds[com]].pressed) || (this.stickbinds[com] && this.stickbinds[com](gamepad));
			this[com+"Clicked"] = this[com] && !this[com+"Last"];
		});
		//gamepad.buttons.forEach((p, d) => {
		//	this.setButton(d, p.pressed)
		//});
	}
	setBinds(binds, stickbinds, stickbindNames) {
		super.setBinds(binds);
		if (stickbinds) {
			this.stickbinds = stickbinds;
			this.stickbindNames = stickbindNames;
		}
	}
	getBindText(command) {
		var butt = GAMEPAD_BUTTON_NAMES[this.binds[command]]; 
		var stick = this.stickbindNames[command];
		if (butt && stick)
			return "(" + butt + ")/(" + stick + ")";
		else if (stick)
			return "(" + stick + ")";
		else
			return "(" + butt + ")";
	}
}
GamepadController.prototype.stickbinds = {};
GamepadController.prototype.stickbindNames = {};
COMMAND_LIST.forEach(com => {
	if (CONTROLS_INFO[com].defaultStickFunc) {
		GamepadController.prototype.stickbinds[com] = CONTROLS_INFO[com].defaultStickFunc;
		GamepadController.prototype.stickbindNames[com] = CONTROLS_INFO[com].defaultStickText;
	}
});

function getGamepad(gpindex) {
	return navigator.getGamepads()[gpindex];
}
//GamepadController.prototype.binds = DEFAULT_BINDS_GAMEPAD;
*/
var globalController = {
	updateBefore : function() {
		COMMAND_LIST.forEach(comm => {
			this[comm] = pControllers.reduce((acc, cont) => acc || cont[comm], false);
			this[comm+"Clicked"] = pControllers.reduce((acc, cont) => acc || cont[comm+"Clicked"], false);
		});
	},
	updateAfter : Controller.prototype.unClick,
	getBindText(command) {
		return pControllers.map(con => con.getBindText(command)).join("/");
	},
	getCameraVector() {
		return pControllers.map(c=>c.getCameraVector()).sort((a,b)=>a.r-b.r)[0] || new VectorRect(0, 0);
	},
	isCommandPressedRepeating(com) {
		return this[com+"Clicked"] || this[com] >= KEY_REPEAT_DELAY && (this[com] - KEY_REPEAT_DELAY) % KEY_REPEAT_RATE == 0;
	}
}

function updateControllersBefore() {
	pControllers.forEach(co=>co.updateBefore());
	globalController.updateBefore();
}

function updateControllersAfter() {
	mouse.unClick();
	//if (pControllers.length <= 0)
	//	pControllers.push(new KeyboardController(controlSettings.keyboard));
	pControllers.forEach(co=>co.updateAfter());
	globalController.updateAfter();
	mouse.unClick();
}
/*
function getController(type) {
	var found = pControllers.find(c => c instanceof type);
	if (found) {
		return found;
	} else {
		var newc = new (type)();
		pControllers.push(newc);
		return newc;
	}
}

//COMMAND_LIST.forEach(function(nom) {
//	controller[nom] = false;
//});

var extraKeyListener = null;

window.addEventListener("gamepadconnected", function(e) {
	gp = e.gamepad;
	if (gp.buttons.length >= 4 && !pControllers.find(co => co.gpindex == gp.index))
		pControllers.push(new GamepadController(gp.index, controlSettings.gamepad));
});*/

var fullKeyController = new NormalKeyboardController();

pControllers = [
	fullKeyController,
]

document.addEventListener("keydown", function(e) {
	//console.log(e.code);
	if (document.activeElement.type != "text" && e.code != "KeyI")
		e.preventDefault();
	if (!keysHeld[e.code])
		keysPressed[e.code] = globalTimer;
	keysHeld[e.code] = globalTimer;
});

document.addEventListener("keyup", function(e) {
	keysHeld[e.code] = false;
});