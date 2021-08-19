class BasicHUD {
	constructor(eng) {
		this.engine = eng;
		this.dialogHandler = new DialogHandler();
		this.sprites1 = getSpriteSheet("HUD1");
	}
	resize() {
		
	}
	update() {
		this.dialogHandler.update();
	}
	draw() {
		this.dialogHandler.draw();
		this.sprites1.drawOnMain(this.engine.playing ? "timerPlaying" : "timerPaused", {x:0, y:0, xadj:0, yadj:0, scale:2});
		drawTextInRect(formatTime(this.engine.stage.time), 85, 10, 300, 60, {align:"left", stroke:"#000000", fill:"#FFFFFF"});
		if (song && settings/music)
			drawTextInRect("♫ " + song.fullname, mainCanvas.width-300, mainCanvas.height-30, 300, 30, {align:"right", stroke:"#000000", fill:"#FFFFFF"});
		this.sprites1.drawOnMain(this.engine.camera.rotateWithFocus ? "cameraRotate" : "cameraFixed", {x:mainCanvas.width, y:0, xadj:1, yadj:0, scale:2});
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

function formatTime(tim) {
	if (typeof tim != "number" && !parseInt(tim) || tim != tim)
		return tim;
	return Math.floor(tim/FPS).toString().padStart(2, "0") + ";" + (tim%FPS).toString().padStart(2, "0");
}