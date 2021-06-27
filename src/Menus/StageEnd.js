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
			func : ()=>startStageAfter(this.stageEngine.stageID),//TODO
		});
		this.restartButton = new MenuButton({
			lText : "StageEnd-Restart",
			bindAlt : true, //TODO bindAlt
			func : ()=>startStageNormally(this.stageEngine.stageID),//TODO
		});
		this.stageSelectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),
		});
		this.connectHoriz(this.restartButton, this.stageSelectButton, this.nextButton);
		this.menuObjects = [
			this.nextButton,
			this.restartButton,
			this.stageSelectButton,
		];
		this.hover(this.nextButton);
	}
	resize() {
		this.nextButton.resize(mainCanvas.width*7/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
		this.restartButton.resize(mainCanvas.width*1/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
		this.stageSelectButton.resize(mainCanvas.width*4/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
	}
	update() {
		super.update();
	}
	draw() {
		this.stageEngine.draw();
		super.draw();
		mainCtx.fillStyle = "#FFFFFF";
		var timesBaseline = mainCanvas.height/3;
		drawTextInRect(lg("StageEnd-Time"), 0, timesBaseline, mainCanvas.width/2, 50, {align:"right", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(this.time, mainCanvas.width/2, timesBaseline, mainCanvas.width/2, 50, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(lg("StageEnd-PrevBestTime"), 0, timesBaseline+50, mainCanvas.width/2, 50, {align:"right", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(this.prevBestTime || "-", mainCanvas.width/2, timesBaseline+50, mainCanvas.width/2, 50, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		if (this.newBestTime) {
			drawTextInRect(lg("StageEnd-NewBestTime"), 0, timesBaseline+100, mainCanvas.width, 50, {fill:"#FFFFFF", stroke:"#000000"});
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