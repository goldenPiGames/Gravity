class SingleStageEngine {
	constructor(args) {
		this.setStage(args.stage);
		this.hud = args.hud || new BasicHUD(this);
		this.winFunc = args.winFunc;
		this.exitFunc = args.exitFunc;
		this.playing = true;
	}
	setStage(stage) {
		this.stage = stage;
		stage.engine = this;
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
		staticWorldCanvas.width = this.stage.width;
		staticWorldCanvas.height = this.stage.height;
		this.camera = new Camera(this.stage);
		this.camera.setFocus(this.stage.cameraFocus || this.stage.objects.find(oj=>oj.focusme) || this.stage.objects.find(oj=>oj.controller));
	}
	switchin() {
		this.stage.drawStatic();
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
	}
	resize() {
		this.camera.setScreenCenter();
	}
	update() {
		if (checkPause(this)) return;
		if (this.playing) {
			this.stage.update();
		}
		this.camera.update();
		this.hud.update();
		if (this.goalReached) {
			this.playing = false;
			this.winFunc(this);//TODO make "end of stage" screen as intermediate
		}
	}
	draw() {
		clearCanvas();
		clearWorld();
		this.stage.background.draw(this.camera);
		this.stage.drawWorld(this, worldCtx);
		this.camera.draw();
		this.hud.draw();
	}
	startDialog(...stuff) {
		this.hud.startDialog(...stuff);
	}
	touchGoal(to) {
		console.log("Won in "+this.stage.time);
		this.goalReached = true;
	}
	exit() {
		this.exitFunc();
	}
}
SingleStageEngine.prototype.controlShow = CONTROL_SHOW_GAME;