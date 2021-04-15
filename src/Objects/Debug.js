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