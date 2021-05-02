const BEST_TIME_SAVE_PREFIX = "GravvityBestTime-";

function finishStageNormally(eng) {
	var skrrrrrrra = new StageEndScreen(eng);
	skrrrrrrra.saveBestTime();
	switchScreen(skrrrrrrra);
}

class StageEndScreen extends MenuScreen {
	constructor(eng) {
		super();
		this.stageEngine = eng;
		this.time = this.stageEngine.stage.time;
		this.nextButton = new MenuButton({
			lText : "StageEnd-Next",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),//TODO
		});
		this.restartButton = new MenuButton({
			lText : "StageEnd-Restart",
			bindAlt : true, //TODO bindAlt
			func : ()=>switchScreen(new StageSelectMenu()),//TODO
		});
		this.stageSelectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),
		});
		this.connectVert(this.nextButton, this.restartButton, this.stageSelectButton);
		this.menuObjects = [
			this.nextButton,
			this.restartButton,
			this.stageSelectButton,
		];
		this.hover(this.nextButton);
	}
	resize() {
		this.nextButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +0, mainCanvas.width/4, 60);
		this.restartButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +80, mainCanvas.width/4, 60);
		this.stageSelectButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +160, mainCanvas.width/4, 60);
	}
	update() {
		super.update();
	}
	draw() {
		this.stageEngine.draw();
		super.draw();
		mainCtx.fillStyle = "#FFFFFF";
		var timesBaseline = mainCanvas.height/3;
		drawTextInRect(lg("StageEnd-Time"), 0, timesBaseline, mainCanvas.width/2, 50, {align:"right"});
		drawTextInRect(this.time, mainCanvas.width/2, timesBaseline, mainCanvas.width/2, 50, {align:"left"});
		drawTextInRect(lg("StageEnd-PrevBestTime"), 0, timesBaseline+50, mainCanvas.width/2, 50, {align:"right"});
		drawTextInRect(this.prevBestTime || "-", mainCanvas.width/2, timesBaseline+50, mainCanvas.width/2, 50, {align:"left"});
		if (this.newBestTime) {
			drawTextInRect(lg("StageEnd-NewBestTime"), 0, timesBaseline+100, mainCanvas.width, 50);
		}
	}
	saveBestTime() {
		const storageKey = BEST_TIME_SAVE_PREFIX+this.stageEngine.stageID;
		this.prevBestTime = parseInt(localStorage.getItem(storageKey));
		if (!(this.time >= this.prevBestTime)) {
			localStorage.setItem(storageKey, this.time);
			this.newBestTime = true;
		}
	}
}