function addWarpPoint(x, y) {
	runnee.stage.addObject(new DebugWarpPoint({midX:x, midY:y, dx:0, dy:0}));
}

class DebugWarpPoint extends GameObject {
	constructor(args) {
		super();
		this.args = args;
	}
	update() {
		if (globalController.menuAltClicked) {
			for (var b in this.args) {
				player.body[b] = this.args[b];
			}
		}
	}
	draw() {
		
	}
}

function addLambda(func) {
	runnee.stage.addObject(new DebugLambda(func));
}

class DebugLambda extends GameObject {
	constructor(lam) {
		super();
		this.func = lam;
	}
	update(stage) {
		this.func(stage);
	}
	draw() {
		
	}
}