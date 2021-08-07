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
		drawTextInRect("♫ " + song.fullname, mainCanvas.width-300, mainCanvas.height-30, 300, 30, {align:"right", stroke:"#000000", fill:"#FFFFFF"});
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