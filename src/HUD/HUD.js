class BasicHUD {
	constructor(eng) {
		this.engine = engine;
		this.dialogHandler = new DialogHandler();
	}
	resize() {
		
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
	resize() {
		
	}
	update() {
		
	}
	draw() {
		
	}
	startDialog(...stuff) {
		
	}
}