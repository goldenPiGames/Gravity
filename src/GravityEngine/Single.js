class SingleStageEngine {
	constructor(stage, hud) {
		this.setStage(stage);
		this.hud = hud;
	}
	setStage(stage) {
		this.stage = stage;
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
		staticWorldCanvas.width = this.stage.width;
		staticWorldCanvas.height = this.stage.height;
		console.log("size changed")
		this.camera = new Camera(this.stage);
		this.camera.focus = this.stage.cameraFocus || this.stage.objects.find(oj=>oj.focusme) || this.stage.objects.find(oj=>oj.controller);
		//this.stage.drawStatic()
		setTimeout(()=>this.stage.drawStatic(), 10); //TODO what the fuck
	}
	update() {
		this.stage.update();
	}
	draw() {
		clearCanvas();
		clearWorld();
		this.stage.drawWorld(this, worldCtx)
		this.camera.draw();
		if (this.hud)
			this.hud.draw();
	}
}