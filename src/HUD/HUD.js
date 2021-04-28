class BasicHUD {
	constructor(eng) {
		this.engine = engine;
		this.dialogHandler = new DialogHandler();
	}
	update() {
		this.dialogHandler.update();
	}
	draw() {
		this.dialogHandler.draw();
	}
	startDialog(...stuff) {
		this.dialogHandler.startDialog(...stuff);
	}
}

class EmptyHUD {
	constructor(eng) {
		this.engine = engine;
	}
	update() {
		
	}
	draw() {
		
	}
	startDialog(...stuff) {
		
	}
}