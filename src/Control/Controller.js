var pControllers = [];

const KEY_REPEAT_DELAY = 10;
const KEY_REPEAT_RATE = 3;

class Controller {
	constructor() {
		COMMAND_LIST.forEach(nom =>	{
			this[nom] = 0;
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
	getMoveVector() {//this is redundant and unused i think?
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
	getHoriz() {
		return 0 + (this.right?1:0) - (this.left?1:0);
	}
}

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
	},
	getHoriz(...stuff) {
		return pControllers.map(c=>c.getHoriz(...stuff)).filter(r=>r)[0] || 0;
	},
	canStageStartNow() {
		return this.leftClicked || this.rightClicked || this.jumpClicked;
	}
}

function updateControllersBefore() {
	pControllers.forEach(co=>co.updateBefore());
	globalController.updateBefore();
	touch.updateBefore();
}

function updateControllersAfter() {
	mouse.unClick();
	//if (pControllers.length <= 0)
	//	pControllers.push(new KeyboardController(controlSettings.keyboard));
	pControllers.forEach(co=>co.updateAfter());
	globalController.updateAfter();
	touch.updateAfter();
	mouse.unClick();
}

function drawControllers() {
	pControllers.forEach(co=>co.draw&&co.draw());
}

function addControlEvents() {
	addResizeEvents();
	addMouseEvents();
	addTouchEvents();
}

function getControllerType() {
	if (!pControllers[0])
		return "Keyboard";
	return pControllers[0].type;
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


var extraKeyListener = null;

});*/