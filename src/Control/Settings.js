


/*GamepadController.prototype.stickbindNames = {
	up : "L↑",
	down : "L↓",
	left : "L←",
	right : "L→",
	menuUp : "L↑",
	menuDown : "L↓",
	menuLeft : "L←",
	menuRight : "L→",
	crouch : "L↓",
	zoomIn : "R↑",
	zoomOut : "R↓",
}*/

function resetControls() {
	controlSettings = {
		keyboard : {},
		gamepad : {},
	};
	COMMAND_LIST.forEach(oj=>{
		controlSettings.keyboard[oj] = CONTROLS_INFO[oj].defaultKeyboard;
		controlSettings.gamepad[oj] = CONTROLS_INFO[oj].defaultGamepad;
	});
	saveControls();
}

function saveControls() {
	localStorage.setItem("AnymosControls", JSON.stringify(controlSettings));
	messageParentControls();
}

function messageParentControls() {
	controlSettings.what = "controls";
	window.parent.postMessage(controlSettings, "*");
}

var controlSettings;
if (localStorage.getItem("AnymosControls"))
	controlSettings = JSON.parse(localStorage.getItem("AnymosControls"));
else {
	resetControls();
}

messageParentControls();

function doControls() {
	emergencyStuff.hidden = false;
	runnee = controlsScreen;
	cameraFocus = {x:0, y:0, width:0, height:0};
	zoomd = 1;
	zoom = 1;
	maxZoom = 1;
	cameraTopBound = -5;
	cameraBottomBound = COMMAND_LIST.length * SETTINGS_ENTRY_HEIGHT;
	cameraFocus.y = (controlsScreen.index+.5) * SETTINGS_ENTRY_HEIGHT;
	updateZoom();
	snapZoom();
}

var controlsScreen = {
	update : function() {
		if (globalController.cancelClicked) {
			doMainMenu();
		} else if (globalController.menuUpClicked) {
			this.index --;
			if (this.index < 0)
				this.index += COMMAND_LIST.length;
		} else if (globalController.menuDownClicked) {
			this.index ++;
			if (this.index >= COMMAND_LIST.length)
				this.index -= COMMAND_LIST.length;
		} else if (globalController.selectClicked) {
			var cname = COMMAND_LIST[this.index];
			var cont = controllers.find(cont => cont.selectClicked);
			if (cont instanceof KeyboardController) {
				awaitRebindKeyboard(cname);
			} else if (cont instanceof GamepadController) {
				awaitRebindGamepad(cname);
			}
			applySettings();
			saveSettings();
		}
		cameraFocus.y = (this.index+.5) * SETTINGS_ENTRY_HEIGHT;
		updateZoom();
	},
	draw : function() {
		mainCtx.globalAlpha = 1;
		clearCanvases();
		mainCtx.font = (SETTINGS_ENTRY_HEIGHT-10)+"px "+getFont();
		mainCtx.fillStyle = "#FFFFFF";
		//mainCtx.drawImage(miscSprites.Selector, 10, 20 + SETTINGS_ENTRY_HEIGHT * (this.index+.5) - miscSprites.Selector.height/2);
		for (var i = 0; i < COMMAND_LIST.length; i++) {
			var com = COMMAND_LIST[i];
			mainCtx.textAlign = "left";
			mainCtx.fillText(com, 20 + miscSprites.Selector.width, stagey(SETTINGS_ENTRY_HEIGHT * (i+.5) + 10));
			mainCtx.textAlign = "center";
			mainCtx.fillText(KEY_NAMES[controlSettings.keyboard[com]], canvas.width*4/10, stagey(SETTINGS_ENTRY_HEIGHT * (i+.5) + 10));
			mainCtx.fillText(GAMEPAD_BUTTON_NAMES[controlSettings.gamepad[com]] || "", canvas.width*6/10, stagey(SETTINGS_ENTRY_HEIGHT * (i+.5) + 10));
		}
		mainCtx.drawImage(miscSprites.Selector, 10, stagey(cameraFocus.y) - miscSprites.Selector.height/2);
	},
	index : 0
}

function rebindCommand(controller, command, newCode) {
	var cont = controlSettings[controller];
	var oldCode = cont[command];
	cont[command] = newCode;
	CONTROLS_INFO[command].mutualExclusion.forEach(ex => {
		if (cont[ex] == newCode)
			cont[ex] = oldCode;
	});
	controllers.forEach(cony => {
		if (cony.binds == cont)
			cony.setBinds(cont)
	});
	saveControls();
}

function awaitRebindKeyboard(command) {
	awaitingRebindKeyboard.command = command;
	awaitingRebindKeyboard.code = undefined;
	extraKeyListener = function(e) {
		awaitingRebindKeyboard.code = e.keyCode;
	}
	runnee = awaitingRebindKeyboard;
}

var awaitingRebindKeyboard = {
	update : function() {
		if (this.code) {
			extraKeyListener = null;
			rebindCommand("keyboard", this.command, this.code);
			runnee = controlsScreen;
		}
	},
	draw : function() {
		controlsScreen.draw();
		mainCtx.lineWidth = 4;
		mainCtx.strokeStyle = "#FFFFFF";
		mainCtx.strokeRect(canvas.width/2-400, canvas.height/2-75, 800, 150);
		mainCtx.fillStyle = "#000000";
		mainCtx.fillRect(canvas.width/2-400, canvas.height/2-75, 800, 150);
		mainCtx.fillStyle = "#FF0000";
		mainCtx.textAlign = "center";
		mainCtx.font = "40px "+getFont();
		mainCtx.fillText("Reassigning keyboard input for:", canvas.width/2, canvas.height/2 - 35);
		mainCtx.fillText(this.command, canvas.width/2, canvas.height/2 + 15);
		mainCtx.fillText("Press a button.", canvas.width/2, canvas.height/2 + 65);
	},
}

function awaitRebindGamepad(command) {
	awaitingRebindGamepad.command = command;
	awaitingRebindGamepad.holdcheck();
	runnee = awaitingRebindGamepad;
}

var awaitingRebindGamepad = {
	update : function() {
		var pressedAny = this.getPressedOnAny();
		//console.log(pressedAny);
		for (var i = 0; i < pressedAny.length; i++) {
			if (pressedAny[i]) {
				if (!this.alreadyHeld[i]) {
					rebindCommand("gamepad", this.command, i);
					runnee = controlsScreen;
					return;
				}
			} else if (this.alreadyHeld[i])
				this.alreadyHeld[i] = false;
		}
	},
	draw : function() {
		controlsScreen.draw();
		mainCtx.lineWidth = 4;
		mainCtx.strokeStyle = "#FFFFFF";
		mainCtx.strokeRect(canvas.width/2-400, canvas.height/2-75, 800, 150);
		mainCtx.fillStyle = "#000000";
		mainCtx.fillRect(canvas.width/2-400, canvas.height/2-75, 800, 150);
		mainCtx.fillStyle = "#FF0000";
		mainCtx.textAlign = "center";
		mainCtx.font = "40px "+getFont();
		mainCtx.fillText("Reassigning gamepad input for:", canvas.width/2, canvas.height/2 - 35);
		mainCtx.fillText(this.command, canvas.width/2, canvas.height/2 + 15);
		mainCtx.fillText("Press a button.", canvas.width/2, canvas.height/2 + 65);
	},
	holdcheck : function() {
		this.alreadyHeld = this.getPressedOnAny();
	},
	getPressedOnAny() {
		var pressedAny = new Array(16);
		for (var i = 0; i < 4; i++) {
			var gp = getGamepad(i);
			if (gp) {
				for (var j = 0; j < gp.buttons.length; j++) {
					pressedAny[j] = pressedAny[j] || gp.buttons[j].pressed >= .9;
				}
			}
		}
		return pressedAny;
	},
}

/*const DEFAULT_BINDS_GAMEPAD = {
	"select" : 0,
	"cancel" : 1,
	"jump" : 0,
	"attack" : 1,
	"shoot" : 2,
	"crouch" : 13,
	"special" : 5,
	"interact" : 4,
	"pause" : 9,
	"restart" : 8,
}
//["jump", "attack", "shoot", "switch", "interact", "special", "?", "debug", "restart", "pause", "?", "?"]//, "up", "down", "left", "right"];
const DEFAULT_BINDS_KEYBOARD = {
	"menuLeft" : 37,
	"menuRight" : 39,
	"menuUp" : 38,
	"menuDown" : 40,
	"select" : 65,
	"cancel" : 83,
	"left" : 37,
	"right" : 39,
	"up" : 38,
	"down" : 40,
	"jump" : 65,
	"attack" : 83,
	"shoot" : 68,
	"crouch" : 40,
	"special" : 16,
	"interact" : 32,
	"switch" : 81,
	"zoomOut" : 189,
	"zoomIn" : 187,
	"pause" : 80,
	"restart" : 82,
}

const DEFAULT_BINDS_KEYBOARD_LEFT = {
	"menuLeft" : 70,
	"menuRight" : 72,
	"menuUp" : 84,
	"menuDown" : 71,
	"select" : 65,
	"cancel" : 83,
	"left" : 70,
	"right" : 72,
	"up" : 84,
	"down" : 71,
	"jump" : 65,
	"attack" : 83,
	"shoot" : 68,
	"crouch" : 71,
	"special" : 16,
	"interact" : 32,
	"switch" : 81,
	//"zoomOut" : 189,
	//"zoomIn" : 187,
	//"pause" : 80,
	"restart" : 82,
}

const DEFAULT_BINDS_KEYBOARD_RIGHT = {
	"menuLeft" : 37,
	"menuRight" : 39,
	"menuUp" : 38,
	"menuDown" : 40,
	"select" : 76,
	"cancel" : 186,
	"left" : 37,
	"right" : 39,
	"up" : 38,
	"down" : 40,
	"jump" : 76,
	"attack" : 186,
	"shoot" : 222,
	"crouch" : 40,
	"special" : 188,
	"interact" : 292,
	"switch" : 79,
	"zoomOut" : 189,
	"zoomIn" : 187,
	"pause" : 80,
	//"restart" : 82,
}*/