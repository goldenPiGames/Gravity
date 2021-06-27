const KEYBOARD_HORIZ_DEADZONE = .2;
var keysPressed = {};
var keysHeld = {};

function isKeyHeld(c) {
	return keysHeld[c];
}

function isKeyPressed(c) {
	return keysPressed[c]>=globalTimer;
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
	getHoriz(offset) {
		let vect = new VectorRect(0 + !!this.right - !!this.left, 0 + !!this.down - !!this.up).rotate(-offset);
		return vect.x >= KEYBOARD_HORIZ_DEADZONE ? 1 : vect.x <= -KEYBOARD_HORIZ_DEADZONE ? -1 : 0;
	}
}
KeyboardController.prototype.type = "Keyboard";
//KeyboardController.prototype.binds = DEFAULT_BINDS_KEYBOARD;

class NormalKeyboardController extends KeyboardController {
	
}

document.addEventListener("keydown", function(e) {
	if (!pControllers.find(p=>p instanceof KeyboardController))
		pControllers.push(new NormalKeyboardController());
	if (keyCodesEnabled)
		console.log(e.code);
	if (document.activeElement.type != "text" && e.code != "KeyI")
		e.preventDefault();
	if (!keysHeld[e.code])
		keysPressed[e.code] = globalTimer;
	keysHeld[e.code] = globalTimer;
});

document.addEventListener("keyup", function(e) {
	keysHeld[e.code] = false;
});

var keyCodesEnabled = false;

function enableKeyCodes() {
	keyCodesEnabled = true;
}