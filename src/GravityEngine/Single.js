class StageEngine {
	constructor(args) {
		this.setStage(args.stage);
	}
	setStage(stage) {
		if (typeof stage == "string") {
			this.stageID = stage;
			this.stage = stageFromRegistry(this.stageID);
		} else if (stage instanceof Stage) {
			this.stage = stage;
		} else {
			this.stage = new Stage(stage);
		}
		this.stage.engine = this;
		this.setWorldSize();
	}
	setWorldSize() {
		staticWorldCanvas.width = this.stage.width;
		staticWorldCanvas.height = this.stage.height;
		this.stage.drawStatic();
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
	}
	resize() {
		this.hud.resize();
		this.camera.resize();
	}
	update() {
		if (this.playing) {
			this.stage.update();
		}
		this.camera.update();
		this.hud.update();
	}
	draw() {
		clearCanvas();
		this.camera.draw();
		this.hud.draw();
	}
	switchin() {
		this.setWorldSize();
	}
}
StageEngine.prototype.playing = true;

class SingleStageEngine extends StageEngine {
	constructor(args) {
		super(args);
		this.hud = args.hud || new BasicHUD(this);
		this.winFunc = args.winFunc;
		this.exitFunc = args.exitFunc;
	}
	setStage(stage) {
		super.setStage(stage);
		this.camera = new FollowingCamera(this.stage);
		this.camera.setFocus(this.stage.cameraFocus || this.stage.objects.find(oj=>oj.focusme) || this.stage.objects.find(oj=>oj.controller));
		playMusic(this.stage.music);
	}
	update() {
		if (checkPause(this)) return;
		super.update();
		if (this.goalReached) {
			this.stage.playing = false;
			this.winFunc(this);//TODO make "end of stage" screen as intermediate
		}
	}
	startDialog(...stuff) {
		this.hud.startDialog(...stuff);
	}
	touchGoal(to) {
		//console.log("Won in "+this.stage.time);
		this.goalReached = true;
	}
	exit() {
		this.exitFunc();
	}
}
SingleStageEngine.prototype.controlShow = CONTROL_SHOW_GAME;

class AttractModeStageEngine extends StageEngine {
	constructor(args) {
		super(args);
		this.hud = new EmptyHUD(this);
	}
	setStage(stage) {
		super.setStage(stage);
		this.camera = new AttractCamera(this.stage);
	}
	update() {
		super.update();
	}
}