const GAMEPAD_HORIZ_DEADZONE = .2;
const GAMEPAD_TRUE_DEADZONE = 0.05;

class GamepadController extends Controller {
	constructor(gpindex) {
		super();
		this.gpindex = gpindex;
	}
	updateBefore() {
		var gamepad = getGamepad(this.gpindex);
		if (!gamepad || !settings.gamepadEnabled) {
			COMMAND_LIST.forEach(com => {
				this[com] = false;
				this[com+"Clicked"] = false;
			});
			return;
		}
		COMMAND_LIST.forEach(com => {
			//console.log(com)
			this[com+"Last"] = this[com];
			this[com] = (CONTROLS_INFO[com].defaultGamepad.findIndex(b=>gamepad.buttons[b].pressed)>=0) ? this[com]+1 : 0;
			//this[com] = (this.binds[com] >= 0 && gamepad.buttons[this.binds[com]].pressed) || (this.stickbinds[com] && this.stickbinds[com](gamepad));
			this[com+"Clicked"] = this[com] && !this[com+"Last"];
		});
		this.ax0 = gamepad.axes[0];
		this.ax1 = gamepad.axes[1];
		if (Math.abs(this.ax0) < GAMEPAD_TRUE_DEADZONE && Math.abs(this.ax1) < GAMEPAD_TRUE_DEADZONE) {
			this.ax0 = 0;
			this.ax1 = 0;
		}
		this.ax2 = gamepad.axes[2];
		this.ax3 = gamepad.axes[3];
		if (Math.abs(this.ax2) < GAMEPAD_TRUE_DEADZONE && Math.abs(this.ax3) < GAMEPAD_TRUE_DEADZONE) {
			this.ax2 = 0;
			this.ax3 = 0;
		}
	}
	/*getBindText(command) {
		var butt = GAMEPAD_BUTTON_NAMES[this.binds[command]]; 
		var stick = this.stickbindNames[command];
		if (butt && stick)
			return "(" + butt + ")/(" + stick + ")";
		else if (stick)
			return "(" + stick + ")";
		else
			return "(" + butt + ")";
	}*/
	getHoriz(offset) {
		let vect = (this.ax0 ? new VectorRect(this.ax0, this.ax1) : new VectorRect(0 + !!this.right - !!this.left, 0 + !!this.down - !!this.up)).rotate(-offset);
		return vect.x >= GAMEPAD_HORIZ_DEADZONE ? 1 : vect.x <= -GAMEPAD_HORIZ_DEADZONE ? -1 : 0;
	}
	getCameraVector() {
		return new VectorRect(this.ax2, this.ax3);
	}
}
GamepadController.prototype.type = "Gamepad";
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

window.addEventListener("gamepadconnected", function(e) {
	gp = e.gamepad;
	if (gp.buttons.length >= 4 && !pControllers.find(co => co.gpindex == gp.index))
		pControllers.push(new GamepadController(gp.index));
});