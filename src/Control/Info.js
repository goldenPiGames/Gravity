const COMMAND_LIST = ["menuLeft", "menuRight", "menuUp", "menuDown", "select", "cancel", "menu3", "left", "right", "up", "down", "jump", "attack", "shoot", "crouch", "special", "interact", /*"switch", */"zoomOut", "zoomIn", "pause", "restart"];

const KEY_NAMES = [0, 1, 2, 3, 4, 5, 6, 7, "Backspace", "Tab", 10, 11, 12, "Enter", 14, 15, "Shift", "Ctrl", "Alt", "Pause", "Caps", 21, 22, 23, 24, 25, 26, "Esc", 28, 29, 30, 31, "Space", "PgUp", "PgDn", "End", "Home", "←", "↑", "→", "↓",
	41, 42, 43, 44, "Ins", "Del", 47, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 58, 59, 60, 61, 62, 63, 64, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"Left Win", "Left Win", "Select", 94, 95, "Num0", "Num1", "Num2", "Num3", "Num4", "Num5", "Num6", "Num7", "Num8", "Num9", "Num*", "Num+", 108, "Num-", "Num.", "Num/", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
	124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, "NumLock", "ScrollLock", 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 
	";", "=", ",", "-", ".", "/", "`", 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, "[", "\\", "]", "'"];

const GAMEPAD_BUTTON_NAMES = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "LPush", "RPush", "D↑", "D↓", "D←", "D→"]

const CONTROLS_INFO = {
	menuLeft : {
		defaultKeyboard : 37,
		defaultGamepad : 14,
		defaultStickFunc : gp => gp.axes[0] <= -.8,
		defaultStickText : "L←",
		mutualExclusion : ["menuRight", "menuUp", "menuDown", "select", "cancel", "menu3", "pause", "restart"],
	},
	menuRight : {
		defaultKeyboard : 39,
		defaultGamepad : 15,
		defaultStickFunc : gp => gp.axes[0] >= .8,
		defaultStickText : "L→",
		mutualExclusion : ["menuLeft", "menuUp", "menuDown", "select", "cancel", "menu3", "pause", "restart"],
	},
	menuUp : {
		defaultKeyboard : 38,
		defaultGamepad : 12,
		defaultStickFunc : gp => gp.axes[1] <= -.8,
		defaultStickText : "L↑",
		mutualExclusion : ["menuLeft", "menuRight", "menuDown", "select", "cancel", "menu3", "pause", "restart"],
	},
	menuDown : {
		defaultKeyboard : 40,
		defaultGamepad : 13,
		defaultStickFunc : gp => gp.axes[1] >= .8,
		defaultStickText : "L↓",
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "select", "cancel", "menu3", "pause", "restart"],
	},
	select : {
		defaultKeyboard : 65,
		defaultGamepad : 0,
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "menuDown", "cancel", "menu3", "pause", "restart"],
	},
	cancel : {
		defaultKeyboard : 83,
		defaultGamepad : 1,
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "menuDown", "select", "menu3", "pause", "restart"],
	},
	menu3 : {
		defaultKeyboard : 68,
		defaultGamepad : 2,
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "menuDown", "select", "cancel", "pause", "restart"],
	},
	left : {
		defaultKeyboard : 37,
		defaultGamepad : 14,
		defaultStickFunc : gp => gp.axes[0] <= -.7,
		defaultStickText : "L←",
		mutualExclusion : ["right", "up", "down", "jump", "attack", "shoot", "crouch", "special", "interact", "pause", "restart"],
	},
	right : {
		defaultKeyboard : 39,
		defaultGamepad : 15,
		defaultStickFunc : gp => gp.axes[0] >= .7,
		defaultStickText : "L→",
		mutualExclusion : ["left", "up", "down", "jump", "attack", "shoot", "crouch", "special", "interact", "pause", "restart"],
	},
	up : {
		defaultKeyboard : 38,
		defaultGamepad : 12,
		defaultStickFunc : gp => gp.axes[1] <= -.7,
		defaultStickText : "L↑",
		mutualExclusion : ["left", "right", "down", "attack", "shoot", "crouch", "special", "pause", "restart"],
	},
	down : {
		defaultKeyboard : 40,
		defaultGamepad : 13,
		defaultStickFunc : gp => gp.axes[1] >= .7,
		defaultStickText : "L↓",
		mutualExclusion : ["left", "right", "up", "attack", "shoot", "special", "pause", "restart"],
	},
	jump : {
		defaultKeyboard : 65,
		defaultGamepad : 0,
		mutualExclusion : ["left", "right", "down", "attack", "shoot", "crouch", "special", "interact", "pause", "restart"],
	},
	attack : {
		defaultKeyboard : 83,
		defaultGamepad : 1,
		mutualExclusion : ["left", "right", "up", "down", "jump", "shoot", "crouch", "special", "interact", "pause", "restart"],
	},
	shoot : {
		defaultKeyboard : 68,
		defaultGamepad : 2,
		mutualExclusion : ["left", "right", "up", "down", "jump", "attack", "crouch", "special", "interact", "pause", "restart"],
	},
	crouch : {
		defaultKeyboard : 40,
		defaultGamepad : 13,
		defaultStickFunc : gp => gp.axes[1] >= .5,
		defaultStickText : "L↓",
		mutualExclusion : ["left", "right", "up", "attack", "shoot", "special", "pause", "restart"],
	},
	special : {
		defaultKeyboard : 16,
		defaultGamepad : 5,
		mutualExclusion : ["left", "right", "up", "down", "jump", "attack", "shoot", "crouch", "interact", "pause", "restart"],
	},
	interact : {
		defaultKeyboard : 32,
		defaultGamepad : 4,
		mutualExclusion : ["left", "right", "attack", "shoot", "crouch", "special", "pause", "restart"],
	},
	zoomOut : {
		defaultKeyboard : 189,
		defaultGamepad : undefined,
		defaultStickFunc : gp => gp.axes[3] >= .8,
		defaultStickText : "R↓",
		mutualExclusion : ["zoomOut", "pause", "restart"],
	},
	zoomIn : {
		defaultKeyboard : 187,
		defaultGamepad : undefined,
		defaultStickFunc : gp => gp.axes[3] <= -.8,
		defaultStickText : "R↑",
		mutualExclusion : ["zoomIn", "pause", "restart"],
	},
	pause : {
		defaultKeyboard : 80,
		defaultGamepad : 9,
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "menuDown", "select", "cancel", "left", "right", "up", "down", "attack", "shoot", "crouch", "special", "zoomIn", "zoomOut", "restart"],
	},
	restart : {
		defaultKeyboard : 82,
		defaultGamepad : 8,
		mutualExclusion : ["menuLeft", "menuRight", "menuUp", "menuDown", "select", "cancel", "left", "right", "up", "down", "attack", "shoot", "crouch", "special", "zoomIn", "zoomOut", "pause"],
	},
}