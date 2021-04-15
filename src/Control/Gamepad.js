
class GamepadController extends Controller {
	constructor(gpindex, binds, stickbinds, stickbindNames) {
		super();
		this.gpindex = gpindex;
		this.setBinds(binds, stickbinds, stickbindNames);
	}
	updateBefore() {
		var gamepad = getGamepad(this.gpindex);
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

window.addEventListener("gamepadconnected", function(e) {
	gp = e.gamepad;
	if (gp.buttons.length >= 4 && !pControllers.find(co => co.gpindex == gp.index))
		pControllers.push(new GamepadController(gp.index));
});